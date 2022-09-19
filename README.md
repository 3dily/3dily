# What is 3dily?

3dily is a library for the use of 3dily.com customers, with which you can display 3D models and 360 images on your site.

# Installing

In the examples below, the `Threedily` object comes either from:

### UMD

- `Threedily` will be registered as a global variable:

```
<link href="./dist/3dily.css" rel="stylesheet" type="text/css">
<script src="./dist/3dily.min.js"></script>
```

### ESM Module

```
<link href="./dist/3dily.css" rel="stylesheet" type="text/css">
<script type="module">
  import { Threedily } from "./dist/3dily.esm.min.js";
</script>
```

### NPM

```
import { Threedily } from '3dily'
import '3dily/style.css'
```

# Usage

```
<div id="3dily-viewer"></div>
<script>
    const opts = {
        containerId: '3dily-viewer',
        panelId: '6314455ed74d211b23946bbd',
        productCode: 'kamran',
    }
    const threedily = Threedily(opts)
</script>
```

## React

#### App.js

```
import { useEffect, useRef } from "react";
import { Threedily } from "3dily";
import "3dily/style.css";

const App = () => {
  const threedily = useRef();

  useEffect(() => {
    threedily.current = Threedily({
      panelId: "6314455ed74d211b23946bbd",
      productCode: "kamran",
      containerId: "3dily-viewer",
    });
    return () => threedily.current?.remove();
  }, []);

  return (
    <div id="3dily-viewer" style={{ width: "500px", height: "500px" }}></div>
  );
};

export default App;
```

# Options

|          Name          |                                                  Description                                                   | Default Value |
| :--------------------: | :------------------------------------------------------------------------------------------------------------: | :-----------: |
| containerId (required) |                      The container element that we render threedily tool on this element                       |      \_       |
|   panelId (required)   | The panel id that you can access thier product. Steps to get panelId: Log in to your panel > Profile > API key |      \_       |
| productCode (required) |                                              Code of the product                                               |      \_       |
|          mode          |                 which feature of threedily do you want to use for your product ? 360 or model                  |     auto      |
|         shadow         |                              shadow use for adding shadow on the printed product                               |     false     |
|        variants        |                                        You specify the default variants                                        |      \_       |
|       background       |                                  the background of product that want to show                                   |    #FFFFFF    |
|         autoAR         |                                 automaticly in mobile must go to ar workspace                                  |     false     |
|         arUrl          |                                   the url address of ar that we want to open                                   | Current page  |

# Methods

|       Name       |      Parameter       |                                                                              Description                                                                              |
| :--------------: | :------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  changeVariants  | ({ layer: variant }) | You can change the variants using this method. The input parameter must be an object of layer code and variant code, for example: { leg: 'blue', feet: 'brown', ... } |
| changeBackground |       (color)        |                                          The color value can be a string of hex, hsl, rgb and color name (color is required)                                          |
|   toggleShadow   |       (value)        |                                    The parameter is optional, if no value is given, it will be false if it is true and vice versa                                     |
|     getData      |          ()          |                                                               With this method, you can get scene data                                                                |
|      remove      |          ()          |                                                               You can delete the scene with this method                                                               |
|        on        |   (eventName, cb)    |                                                     With this method, you can add a callback to the desired event                                                     |
|       off        |   (eventName, cb)    |                                                  With this method, you can remove a callback from the desired event                                                   |

# Events

|     name     | Arguments |               Description               |
| :----------: | :-------: | :-------------------------------------: |
| change-frame |  (frame)  | Event will fired on active frame change |

# Demos

[Simple](https://codesandbox.io/s/jovial-river-cfrpy4?file=/index.html)

[React](https://codesandbox.io/s/headless-currying-ov564i?file=/src/App.js)
