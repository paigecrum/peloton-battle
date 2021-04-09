import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Spinner, Text } from 'grommet'
import { Bike } from 'grommet-icons'

export default function Loading({ text = 'Loading', speed = 300}) {
  const [content, setContent] = useState(text);

  useEffect(() => {
    const id = window.setInterval(() => {
      setContent((content) => {
        return content === `${text}...`
          ? text
          : `${content}.`
      })
    }, speed)

    return () => window.clearInterval(id)
  }, [text, speed])

  return (
    <Box align='center' direction='row' gap='medium' margin={{ vertical: 'medium' }}>
      <Spinner />
      <Text alignSelf='center' size='large'>
        { content }
      </Text>
      <Bike />
    </Box>
  )
}

Loading.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number
}
