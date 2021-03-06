/* @flow */

import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { Platform, View, ScrollView, StyleSheet } from 'react-native';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { SceneRendererProps, Route } from './TabViewTypeDefinitions';
import {RNCubeTransition} from 'react-native-cube-transition';

type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      x: number,
      y: number,
    },
  },
};

type State = {
  initialOffset: { x: number, y: number },
};

type Props<T> = SceneRendererProps<T> & {
  animationEnabled?: boolean,
  swipeEnabled?: boolean,
  children?: React.Element<any>,
};

export default class TabViewPagerScroll<T: Route<*>>
  extends PureComponent<void, Props<T>, State> {
  static propTypes = {
    ...SceneRendererPropType,
    animationEnabled: PropTypes.bool,
    swipeEnabled: PropTypes.bool,
    children: PropTypes.node,
  };

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      initialOffset: {
        x: this.props.navigationState.index * this.props.layout.width,
        y: 0,
      },
    };
  }

  state: State;

  componentDidMount() {
    this._scrollTo(
      this.props.navigationState.index * this.props.layout.width,
      false,
    );
    this._resetListener = this.props.subscribe('reset', this._scrollTo);
  }

  componentDidUpdate(prevProps: Props<T>) {
    const amount = this.props.navigationState.index * this.props.layout.width;
    if (
      prevProps.navigationState !== this.props.navigationState ||
      prevProps.layout !== this.props.layout
    ) {
      if (
        Platform.OS === 'android' ||
        prevProps.navigationState !== this.props.navigationState
      ) {
        global.requestAnimationFrame(() => this._scrollTo(amount));
      } else {
        this._scrollTo(amount, false);
      }
    }
  }

  componentWillUnmount() {
    this._resetListener.remove();
  }

  _resetListener: Object;
  _scrollView: Object;
  _nextOffset = 0;
  _isIdle: boolean = true;

  _scrollTo = (x: number, animated = this.props.animationEnabled !== false) => {
    this._nextOffset = x;

    if (this._isIdle && this._scrollView) {
      this._scrollView.scrollTo({
        x,
        animated,
      });
    }
  };

  _handleMomentumScrollEnd = (e: ScrollEvent) => {
    const nextIndex = Math.round(
      e.nativeEvent.contentOffset.x / this.props.layout.width,
    );
    this._isIdle = true;
    this.props.jumpToIndex(nextIndex);
  };

  _handleScroll = (e: ScrollEvent) => {
    this._isIdle = e.nativeEvent.contentOffset.x === this._nextOffset;
    this.props.position.setValue(
      e.nativeEvent.contentOffset.x / this.props.layout.width,
    );
  };

  _setRef = (el: Object) => (this._scrollView = el);

  render() {
    const { children, layout, navigationState } = this.props;
    return (
      <RNCubeTransition style={styles.cube} index={navigationState.index}>
        {Children.map(children, (child, i) => (
          <View
            key={navigationState.routes[i].key}
            testID={navigationState.routes[i].testID}
            style={
              layout.width
                ? { width: layout.width, overflow: 'hidden' }
                : i === navigationState.index ? styles.page : null
            }
          >
            {i === navigationState.index || layout.width ? child : null}
          </View>
        ))}
      </RNCubeTransition>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  page: {
    flex: 1,
    overflow: 'hidden',
  },
  cube: {
    position: 'absolute',
    flexDirection: 'row',
    overflow: 'hidden',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
