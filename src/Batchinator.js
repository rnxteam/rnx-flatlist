/*
  eslint-disable

  no-underscore-dangle,
  max-len,
  consistent-return,
  no-mixed-operators,
  no-unused-expressions,
  no-confusing-arrow,
  no-plusplus,

  react/prop-types
 */
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Batchinator
 * @flow
 */

import {
  InteractionManager,
} from 'react-native';

/**
 * A simple class for batching up invocations of a low-pri callback. A timeout is set to run the
 * callback once after a delay, no matter how many times it's scheduled. Once the delay is reached,
 * InteractionManager.runAfterInteractions is used to invoke the callback after any hi-pri
 * interactions are done running.
 *
 * Make sure to cleanup with dispose().  Example:
 *
 *   class Widget extends React.Component {
 *     _batchedSave: new Batchinator(() => this._saveState, 1000);
 *     _saveSate() {
 *       // save this.state to disk
 *     }
 *     componentDidUpdate() {
 *       this._batchedSave.schedule();
 *     }
 *     componentWillUnmount() {
 *       this._batchedSave.dispose();
 *     }
 *     ...
 *   }
 */
class Batchinator {
  _callback;
  _delay;
  _taskHandle;
  constructor(callback, delayMS) {
    this._delay = delayMS;
    this._callback = callback;
  }
  /*
   * Cleanup any pending tasks.
   *
   * By default, if there is a pending task the callback is run immediately. Set the option abort to
   * true to not call the callback if it was pending.
   */
  dispose(options) {
    if (this._taskHandle) {
      this._taskHandle.cancel();
      if (!options.abort) {
        this._callback();
      }
      this._taskHandle = null;
    }
  }
  schedule() {
    if (this._taskHandle) {
      return;
    }
    const timeoutHandle = setTimeout(() => {
      this._taskHandle = InteractionManager.runAfterInteractions(() => {
        // Note that we clear the handle before invoking the callback so that if the callback calls
        // schedule again, it will actually schedule another task.
        this._taskHandle = null;
        this._callback();
      });
    }, this._delay);
    this._taskHandle = { cancel: () => clearTimeout(timeoutHandle) };
  }
}

module.exports = Batchinator;