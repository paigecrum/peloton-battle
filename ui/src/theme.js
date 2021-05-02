import { grommet } from "grommet"
import { deepMerge } from "grommet/utils"

export const theme = deepMerge(grommet, {
  global: {
    colors: {
      brand: 'hsl(208,100%,50%)',
      text: {
        dark: '#f8f8f8',
        light: '#270000'
      }
    },
    focus: {
      border: {
        color: 'hsl(208,100%,50%)'
      }
    }
  },
  menu: {
    extend: {
      'font-size': '14px'
    }
  }
});
