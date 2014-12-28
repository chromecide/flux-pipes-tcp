//write some data to the client

function tcpClientWrite(ctx, cbs){
    var client = ctx.tcp.client;

    try{
        if(Array.isArray(client)){
            for(var i=0;i<client.length;i++){
                client[i].write(this.cfg.data);
            }
        }else{
            client.write(this.cfg.data);
        }

        if(cbs && cbs.success){
            cbs.success(ctx);
        }
    }catch(err){
        if(cbs && cbs.error){
            cbs.error(err);
        }
    }
}

tcpClientWrite.flux_pipe = {
    name: 'TCP : Client : Write',
    description: 'Writes Data to the connected socket',
    configs:[
        {
            name: 'data',
            description: 'The data to write to the socket'
        }
    ]
};

module.exports = tcpClientWrite;