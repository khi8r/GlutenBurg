const licenseChecker = require('license-checker')
const fs = require('fs')
const packageJson = require('../package.json')
const coreDeps = Object.keys(packageJson.dependencies || {})
const devDeps = Object.keys(packageJson.devDependencies || {})

licenseChecker.init({
  start: process.cwd(),
  json: true
}, function (err, packages) {
  if (err) {
    console.error('Error:', err)
    process.exit(1)
  }
  const coreRows = []
  const devRows = []
  const coreSeen = new Set()
  const devSeen = new Set()
  Object.entries(packages).forEach(([pkg, info]) => {
    const name = pkg.replace(/@[^@]+$/, '')
    const license = info.licenses || ''
    const repo = info.repository || ''
    const row = `| ${name} | ${license} | [repo](${repo}) |`
    if (coreDeps.includes(name)) {
      if (!coreSeen.has(name)) {
        coreRows.push(row)
        coreSeen.add(name)
      }
    } else if (devDeps.includes(name)) {
      if (!devSeen.has(name)) {
        devRows.push(row)
        devSeen.add(name)
      }
    }
  })
  const tableHeader = '| Package | License | Repository |\n|---|---|---|'
  const coreTable = `${tableHeader}\n${coreRows.join('\n')}`
  const devTable = `${tableHeader}\n${devRows.join('\n')}`
  const output = `# Core Dependencies\n${coreTable}\n\n# Dev Dependencies\n${devTable}\n`
  fs.writeFileSync('LICENSES_TABLE.md', output)
  console.log('LICENSES_TABLE.md generated.')
})
