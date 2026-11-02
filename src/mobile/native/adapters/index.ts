/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 38
 * Pintu Masuk Adaptor Platform Native (Platform Adapters Entry)
 */

import { AdaptorPlatformNative } from './platform_adapter';
import { AdaptorAndroidMobile } from './android_adapter';
import { AdaptorIOSMobile } from './ios_adapter';
import { AdaptorSimulatorMobile } from './simulator_adapter';
import { InfoPerangkatMobile } from '../../device/info';

export * from './platform_adapter';
export * from './android_adapter';
export * from './ios_adapter';
export * from './simulator_adapter';

let adaptorAktif: AdaptorPlatformNative | undefined;

export function dapatkanAdaptorPlatformAktif(): AdaptorPlatformNative {
  if (!adaptorAktif) {
    const info = InfoPerangkatMobile.dapatkanInfo();
    if (info.platform === 'android') {
      adaptorAktif = new AdaptorAndroidMobile();
    } else if (info.platform === 'ios') {
      adaptorAktif = new AdaptorIOSMobile();
    } else {
      adaptorAktif = new AdaptorSimulatorMobile();
    }
  }
  return adaptorAktif;
}

export function tetapkanAdaptorPlatform(adaptor: AdaptorPlatformNative): void {
  adaptorAktif = adaptor;
}
