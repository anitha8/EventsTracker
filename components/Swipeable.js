import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View
} from 'react-native';

const X_AXIS_CAPTURE_THRESHOLD = 3;
const ANIMATED_TENSION = 300;
const ANIMATED_FRICTION = 30;

export default class Swipeable extends Component {
  static defaultProps = {
    index: 0,
    threshold: 5,
    itemsInScreen: 1,
    inputRange: [0, 1],
  };

  constructor(props) {
    super(props);
    this.state = {
      indexLatest: props.index,
      indexCurrent: new Animated.Value(props.index),
      viewWidth: Dimensions.get('window').width
    };
    this.panResponder;
  }

  componentDidMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);

        return dx > dy && dx > X_AXIS_CAPTURE_THRESHOLD;
      },
      onPanResponderRelease: this.handleTouchEnd,
      onPanResponderTerminate: this.handleTouchEnd,
      onPanResponderMove: this.handleTouchMove,
      onPanResponderGrant: this.handleTouchStart
    });
  }

  static getDerivedStateFromProps(nextProps) {
    const { index } = nextProps;
    const propsIndex = this.props && this.props.index
    if (typeof index === 'number' && propsIndex && index !== propsIndex) {
      this.setState({indexLatest: index},
        () => {
          Animated.spring(this.state.indexCurrent, {
            toValue: index,
            tension: ANIMATED_TENSION,
            friction: ANIMATED_FRICTION,
            useNativeDriver: true
          }).start();
        }
      );
    }
    return null;
  }

  selectNewIndex = (vx, indexCurrent, indexStart) => {
    let indexNew;
    if (Math.abs(vx) * 10 > this.props.threshold) {
      if (vx > 0) {
        indexNew = Math.floor(indexCurrent);
      } else {
        indexNew = Math.ceil(indexCurrent);
      }
    } else {
      if (Math.abs(indexStart - indexCurrent) > 0.6) {
        indexNew = Math.round(indexCurrent);
      } else {
        indexNew = indexStart;
      }
    }

    const indexMax = React.Children.count(this.props.children) - 1;

    if (indexNew < 0) {
      indexNew = 0;
    } else if (indexNew > indexMax) {
      indexNew = indexMax;
    }
    return indexNew;
  };

  transtionToSlide = (indexNew) => {
    this.setState({indexLatest: indexNew},
      () => {
        Animated.spring(this.state.indexCurrent, {
          toValue: indexNew,
          tension: ANIMATED_TENSION,
          friction: ANIMATED_FRICTION,
          useNativeDriver: true
        }).start();

        if (this.props.onChangeIndex) {
          this.props.onChangeIndex(indexNew);
        }
      }
    );
  };

  handleTouchStart = (event, gestureState) => {
    this.startX = gestureState.x0;
  };

  handleTouchMove = (event, gestureState) => {
    const { moveX } = gestureState;

    let index = this.state.indexLatest + (this.startX - moveX) / this.state.viewWidth;

    const indexMax = React.Children.count(this.props.children) - 1;

    if (index < 0) {
      index = 0;
      this.startX = moveX;
    } else if (index > indexMax) {
      index = indexMax;
      this.startX = moveX;
    }

    this.state.indexCurrent.setValue(index);
  };

  handleTouchEnd = (event, gestureState) => {
    const { vx, moveX } = gestureState;

    const indexStart = this.state.indexLatest;
    const indexCurrent = indexStart + (this.startX - moveX) / this.state.viewWidth;

    const indexNew = this.selectNewIndex(vx, indexCurrent, indexStart);

    this.transtionToSlide(indexNew);
  };

  handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;

    if (width) {
      this.setState({
        viewWidth: width / this.props.itemsInScreen
      });
    }
  };

  render() {
    const { children } = this.props;
    const { indexCurrent, viewWidth } = this.state;
    const childrenToRender = React.Children.map(children, (child, index) => {
        return (
          <View style={[styles.slide, child.props.style]}>
            {React.cloneElement(child, {
              swipeableInjectedProps: {
                slideIndex: index,
                animatedValue: this.state.indexCurrent
              }
            })}
          </View>
        );
    });

    const sceneContainerStyle = {
      width: viewWidth * React.Children.count(children),
      transform: [
        {
          translateX: indexCurrent.interpolate({
            inputRange: this.props.inputRange,
            outputRange: [0, -viewWidth]
          })
        }
      ]
    };

    const panHandlers = this.panResponder && this.panResponder.panHandlers
    return (
      <View style={styles.root} onLayout={this.handleLayout}>
        <Animated.View
          {...panHandlers}
          style={[styles.container, sceneContainerStyle]}
        >
          {childrenToRender}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden'
  },
  container: {
    flexDirection: 'row'
  },
  slide: {
    flex: 1
  }
});
