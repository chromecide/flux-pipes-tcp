var http = require('http');

function tcpListen(ctx, cbs){
    var server = ctx.tcp.server;
    server.listen(ctx.port, ctx.port);

    if(cbs && cbs.success){
        cbs.success(ctx);
    }
}

tcpListen.flux_pipe = {
    name: 'TCP : Server : Listen',
    description: 'Starts the NodeJS TCP server listening on the supplied port and host',
    configs:[
        {
            name: 'port',
            description: 'The port the TCP Server should listen on'
        },
        {
            name: 'host',
            description: 'The host the TCP Server should accept connections for'
        }
    ]
};

module.exports = tcpListen;