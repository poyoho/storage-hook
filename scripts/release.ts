import prompts from 'prompts'
import semver from 'semver'
import colors from 'picocolors'
import {
  args,
  getVersionChoices,
  isDryRun,
  logRecentCommits,
  run,
  runIfNotDry,
  step,
  updateVersion,
  getPackageInfo
} from './releaseUtils'

async function main(): Promise<void> {
  let targetVersion: string | undefined

  await logRecentCommits()

  const { currentVersion, pkgPath } = await getPackageInfo()

  if (!targetVersion) {
    const { release }: { release: string } = await prompts({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: getVersionChoices(currentVersion)
    })

    if (release === 'custom') {
      const res: { version: string } = await prompts({
        type: 'text',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion
      })
      targetVersion = res.version
    } else {
      targetVersion = release
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  const tag = `v${targetVersion}`

  if (targetVersion.includes('beta') && !args.tag) {
    args.tag = 'beta'
  }

  const { yes }: { yes: boolean } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Releasing ${colors.yellow(tag)} Confirm?`
  })

  if (!yes) {
    return
  }

  step('\nUpdating package version...')
  updateVersion(pkgPath, targetVersion)

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', ['add', '-A'])
    await runIfNotDry('git', ['commit', '-m', `release: ${tag}`])
    await runIfNotDry('git', ['tag', tag])
  } else {
    console.log('No changes to commit.')
    return
  }

  step('\nPushing to GitHub...')
  await runIfNotDry('git', ['push', 'origin', `refs/tags/${tag}`])
  await runIfNotDry('git', ['push'])

  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`)
  } else {
    console.log(
      colors.green(
        '\nPushed, publishing should starts shortly on CI.\nhttps://github.com/poyoho/storage-hook/actions/workflows/publish.yml'
      )
    )
  }

  console.log()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
