import React from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Button, Heading, Text } from 'grommet'

const PageNotFound = () => {
  const history = useHistory();

  return (
    <>
      <Box justify='center' align='center'  fill='vertical' pad={{ top: '30vh' }}>
        <Heading level='1' size='140px' margin='none' pad='xlarge'>404</Heading>
      </Box>
      <Box align='center'>
        <Text size='xlarge'>Page Not Found</Text>
        <Button label='Home' margin='small' onClick={() => history.push(`/`)} />
      </Box>
    </>
  )
};

export default PageNotFound;
