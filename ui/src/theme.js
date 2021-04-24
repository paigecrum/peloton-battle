import { grommet } from "grommet"
import { deepMerge } from "grommet/utils"

export const theme = deepMerge(grommet, {
  global: {
    colors: {
      brand: 'hsl(218,99%,66%)'
    },
    focus: {
      border: {
        color: 'hsl(218,99%,66%)'
      }
    }
  },
});
