var net = require('net');

var connectedClients = [];

function tcpCreateServer(ctx, cbs){
    try{
        var tcpServer = net.createServer(function(conn){
            connectedClients.push(conn);

            if(ctx.tcp_client_connected_pipe){
                var newCtx = {
                    tcp:{
                        client: conn
                    }
                };

                ctx._pipes.publish(ctx.tcp_client_connected_pipe, newCtx);
            }

            conn.on('data', function(buff){
                console.log(buff.toString());
                if(ctx.connection_data_pipe){
                    var newCtx = {
                        tcp: {
                            client: conn,
                            data: buff
                        }
                    };

                    ctx._pipes.publish(ctx.connection_data_pipe, newCtx);
                }
            });

            conn.on('error', function(err){
                if(ctx.connection_error_pipe){
                    var newCtx = {
                        tcp: {
                            client: conn,
                            error: err
                        }
                    };

                    ctx._pipes.publish(ctx.connection_error_pipe, newCtx);
                }
            });

            conn.on('timeout', function(){
                if(ctx.connection_timeout_pipe){
                    var newCtx = {
                        tcp: {
                            client: conn
                        }
                    };

                    ctx._pipes.publish(ctx.connection_timeout_pipe, newCtx);
                }
            });

            conn.on('end', function(){
                if(ctx.connection_end_pipe){
                    var newCtx = {
                        tcp: {
                            client: conn
                        }
                    };

                    ctx._pipes.publish(ctx.connection_end_pipe, newCtx);
                }
            });

            conn.on('close', function(){
                for(var i=0;i<connectedClients.length;i++){
                    if(connectedClients[i]==conn){
                        connectedClients.splice(i, 1);
                        continue;
                    }
                }

                if(ctx.tcp_client_closed_pipe){
                    var newCtx = {
                        tcp: {
                            client: conn
                        }
                    };

                    ctx._pipes.publish(ctx.tcp_client_closed_pipe, newCtx);
                }
            });
        });

        ctx.tcp = {
            server: tcpServer,
            clients: connectedClients
        };

        if(cbs && cbs.success){
            cbs.success(ctx);
        }
    }catch(err){
        if(cbs && cbs.error){
            cbs.error(err);
        }
    }
}


tcpCreateServer.flux_pipe = {
    name: 'TCP : Server : CreateServer',
    description: 'Creates a NodeJS Net Server',
    configs:[
        {
            name: 'connection_begin_pipe',
            description: 'The name of the pipe to publish new tcp connections to'
        },
        {
            name: 'connection_end_pipe',
            description: 'The name of the pipe to publish tcp connections to when they have been closed'
        },
        {
            name: 'connection_timeout_pipe',
            description: 'The name of the pipe to publish tcp connections to when they timeout'
        },
        {
            name: 'connection_data_pipe',
            description: 'The name of the pipe to publish tcp connections to when they receive data'
        },
        {
            name: 'connection_error_pipe',
            description: 'The name of the pipe to publish tcp connections to when they throw an error'
        }
    ]
};

module.exports = tcpCreateServer;