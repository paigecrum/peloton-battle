import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  content: {
    fontSize: '35px',
    position: 'absolute',
    left: '0',
    right: '0',
    marginTop: '20px',
    textAlign: 'center',
    textTransform: 'capitalize'
  }
}

export default class Loading extends React.Component {
  state = { text: this.props.text }

  static propTypes = {
    text: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired
  }

  static defaultProps = {
    text: 'Loading',
    speed: 300
  }

  componentDidMount() {
    const { text: customText, speed } = this.props

    this.interval = window.setInterval(() => {
      this.state.text === customText + '...'
      ? this.setState({ text: customText })
      : this.setState(({ text }) => ({ text: text + '.'}))
    }, speed)
  }
  componentWillUnmount() {
    window.clearInterval(this.interval)
  }
  render() {
    return (
      <p style={styles.content}>
        { this.state.text }
      </p>
    )
  }
}
