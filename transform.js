module.exports = function (RED) {
    function isMessage(value) {
        return typeof value === 'object' || value === undefined;
    }

    function isOutputPacket(value) {
        return Array.isArray(value) ? value.every(isMessage) : isMessage(value);
    }

    function isFlowPacket(value) {
        return Array.isArray(value) ? value.every(isOutputPacket) : isMessage(value);
    }

    function build(template, node) {
        return RED.util.prepareJSONataExpression(template, node);
    }

    function transform(message, expression) {
       
        const result = RED.util.evaluateJSONataExpression(expression, message);

        if (!isFlowPacket(result)) {
            throw new Error('The transformation result has an invalid structure.');
        }

        return result;
    }

    function TransformNode(config) {
        RED.nodes.createNode(this, config);

        const nodeExpression = config.template;
        const node = this;

        this.on('input', (message, send, done) => {
            let error, result;
            const expression = message.template || nodeExpression;

            if (!expression) {
                error = {
                    message: 'No template specified'
                }
                done(error);
            }

            try {
                const preparedExpression = build(expression, node);
                result = transform(message, preparedExpression);
            } catch (e) {
                error = e.message;
            }

            if (error) {
                done(error);
            } else {
                send(result);
                done();
            }
        });
    }

    RED.nodes.registerType("transform", TransformNode);
}