/* eslint-disable import/no-extraneous-dependencies */
const { Namer } = require('@parcel/plugin')
const { default: defaultName } = require('@parcel/namer-default')

const CONFIG = Symbol.for('parcel-plugin-config')

function buildNameWithoutHash(bundle, oldName) {
  if (bundle?.needsStableName) return oldName

  const pieces = oldName.split('.')
  pieces.splice(pieces.length - 2, 1)

  const { outputFormat } = bundle.env
  if (bundle.type === 'js' && outputFormat !== 'esmodule') {
    pieces.splice(pieces.length - 1, 0, outputFormat)
  }
  return pieces.join('.')
}

module.exports = new Namer({
  async name({ bundle, bundleGraph, logger }) {
    const group = bundleGraph.getBundleGroupsContainingBundle(bundle)[0]
    const oldName = await defaultName[CONFIG].name({
      bundle,
      bundleGraph,
      logger,
    })

    return bundleGraph.isEntryBundleGroup(group)
      ? buildNameWithoutHash(bundle, oldName)
      : oldName
  },
})
