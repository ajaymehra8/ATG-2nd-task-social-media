import { Box,Text } from '@chakra-ui/react'
import React from 'react'

const Trend = ({trend}) => {
  return (
    <Box w={"100%"} padding={"14px 4px"} paddingLeft={"40px"} cursor={'pointer'} >
      <Text style={{fontWeight:"500",fontSize:"20px",letterSpacing:"2px"}}>{trend.name}</Text>
      <Text>{trend.posts} posts</Text>

    </Box>
  )
}

export default Trend
