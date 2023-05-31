module.exports = function (RED) {
   
    function build(template, node) {
        return RED.util.prepareJSONataExpression(template, node);
    }

    function transform(message, expression) {
        const result = RED.util.evaluateJSONataExpression(expression, message);

        return result;
    }

    function getConfiguredTemplateValue(node, msg, exp, expType) {
        if (expType == 'jsonata') {
            return exp;
        } else {
            return RED.util.evaluateNodeProperty(exp, expType, node, msg);
        }
    }

    function JSONataTransformNode(config) {
        RED.nodes.createNode(this, config);

        const nodeExpression = config.template;
        const nodeExpressionType = config.templateType;
        const nodeTarget = config.target;
        const nodeTargetType = config.targetType;
        const node = this;

        this.on('input', (message, send, done) => {
            let error, result;
            const expression = message.template
                || getConfiguredTemplateValue(node, message, nodeExpression, nodeExpressionType);

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
                if (nodeTargetType == 'msg') {
                    RED.util.setMessageProperty(message, nodeTarget, result, true);

                } else if (nodeTargetType == 'flow') {
                    var flowContext = this.context().flow;
                    flowContext.set(nodeTarget, result);

                } else if (nodeTargetType == 'global') {
                    var globalContext = this.context().global;
                    globalContext.set(nodeTarget, result);
                }

                send(message);
                done();
            }
        });
    }

    RED.nodes.registerType("com.autana.jsonata", JSONataTransformNode);
}