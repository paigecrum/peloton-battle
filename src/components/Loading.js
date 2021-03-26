import React from 'react'
import PropTypes from 'prop-types'
import { Box, Spinner, Text } from 'grommet'
import { Bike } from 'grommet-icons'


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
      <Box align='center' direction='row' gap='medium' margin={{ vertical: 'medium' }}>
        <Spinner />
        <Text alignSelf='center' size='large'>
          { this.state.text }
        </Text>
        <Bike />
      </Box>
    )
  }
}
