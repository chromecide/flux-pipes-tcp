var net = require('net');

//connect to a tcp server
function tcpConnect(ctx, cbs){
    var client = new net.Socket();

    if(ctx.tcp_data_pipe){
        client.on('data', function(buff){
            var newCtx = {
                tcp: {
                    client: client,
                    data: buff
                }
            };
            ctx._pipes.publish(ctx.tcp_data_pipe, newCtx);
        });
    }

    if(ctx.tcp_error_pipe){
        client.on('error', function(err){
            var newCtx = {
                tcp: {
                    client: client,
                    error: err
                }
            };
            ctx._pipes.publish(ctx.tcp_error_pipe, newCtx);
        });
    }

    if(ctx.tcp_timeout_pipe){
        client.on('timeout', function(){
            var newCtx = {
                tcp: {
                    client: client
                }
            };

            ctx._pipes.publish(ctx.tcp_timeout_pipe, newCtx);
        });
    }

    if(ctx.tcp_end_pipe){
        client.on('end', function(){
            var newCtx = {
                tcp: {
                    client: client
                }
            };
            
            ctx._pipes.publish(ctx.tcp_end_pipe, newCtx);
        });
    }

    if(ctx.tcp_closed_pipe){
        client.on('close', function(){
            var newCtx = {
                tcp: {
                    client: client
                }
            };
            
            ctx._pipes.publish(ctx.tcp_closed_pipe, newCtx);
        });
    }

    try{
        client.connect(ctx.port, ctx.host, function(){
            ctx.tcp = {
                client: client
            };

            if(cbs && cbs.success){
                cbs.success(ctx);
            }
        });
    }catch(err){
        if(cbs && cbs.error){
            cbs.error(err);
        }
    }
}

tcpConnect.flux_pipe = {
    name: 'TCP : Client : Connect',
    description: 'Connects to a TCP Server',
    configs:[
        {
            name: 'port',
            description: 'The port the TCP Server is running on'
        },
        {
            name: 'host',
            description: 'The host the TCP Server is running on'
        },
        {
            name: 'tcp_begin_pipe',
            description: 'The name of the pipe to publish new tcp connections to'
        },
        {
            name: 'tcp_end_pipe',
            description: 'The name of the pipe to publish tcp connections to when they have been closed'
        },
        {
            name: 'tcp_timeout_pipe',
            description: 'The name of the pipe to publish tcp connections to when they timeout'
        },
        {
            name: 'tcp_data_pipe',
            description: 'The name of the pipe to publish tcp connections to when they receive data'
        },
        {
            name: 'tcp_error_pipe',
            description: 'The name of the pipe to publish tcp connections to when they throw an error'
        }
    ]
};

module.exports = tcpConnect;