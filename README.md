# autana-jsonata-transform

## Use the power of [JSONata](https://jsonata.org/) to easily transform [Node-RED](https://nodered.org/) messages. 

### Installation:

```
npm install autana-jsonata-transform
```

### Usage:

Just enter the template as a valid [JSONata](https://jsonata.org/) expression and enjoy the transformation. 

This node can receive the template from: 
 - static: template field value from node configuration
 - dynamic: from <code>msg.template</code>

#### Template example:

```javascript
{
    "topic": topic & "_ceil",
    "payload": $ceil(payload)
}
```

#### Output:

By default the transformation result is saved in <code>msg.payload</code>. But you can decide the field, and inclusive use <code>flow</code> or <code>global</code> context instead.

