'use strict';

const detectLibc = require('detect-libc');

const env = process.env;

module.exports = function () {
  let arch = env.npm_config_arch || process.arch;
  const platform = env.npm_config_platform || process.platform;
  /* istanbul ignore next */
  const libc = (platform === 'linux' && detectLibc.isNonGlibcLinuxSync()) ? detectLibc.familySync() : '';

  const platformId = [`${platform}${libc}`];

  // TODO: 强制使用32位版本
  if(platform === 'win32' && arch === 'x64') {
    arch = 'ia32';
  }

  if (arch === 'arm') {
    const fallback = process.versions.electron ? '7' : '6';
    platformId.push(`armv${env.npm_config_arm_version || process.config.variables.arm_version || fallback}`);
  } else if (arch === 'arm64') {
    platformId.push(`arm64v${env.npm_config_arm_version || '8'}`);
  } else {
    platformId.push(arch);
  }

  return platformId.join('-');
};
