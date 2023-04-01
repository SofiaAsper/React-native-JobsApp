import React from 'react'
import { View, Text } from 'react-native'

import styles from './specifics.style'

const Specifics = ({ title, points }) => {
  return (
    <View>
      <Text style={styles.title}>{title}:</Text>
      <View>
        {points.map((item, index) => (
          <View style={styles.pointWrapper} key={item + index}>
            <View style={styles.pointDot} />
            <Text style={styles.pointText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default Specifics