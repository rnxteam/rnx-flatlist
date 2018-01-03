import React from 'react';
import shallowEqual from 'fbjs/lib/shallowEqual.js';

export function shouldComponentUpdate(nextProps, nextState) {
  return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
}
export function pureRender(component) {
  if (component.prototype.shouldComponentUpdate !== undefined) {
    console.warn('Cannot decorate `%s` with @pureRenderDecorator', 'because it already implements `shouldComponentUpdate().'); // eslint-disable-line
  }
  component.prototype.shouldComponentUpdate = shouldComponentUpdate;
  return component;
}
export default class PureComponent extends React.Component { }
PureComponent.prototype.shouldComponentUpdate = shouldComponentUpdate;
React.PureComponent = React.PureComponent || PureComponent;
