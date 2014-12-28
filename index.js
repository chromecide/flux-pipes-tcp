var flux_pipes_tcp = {
    actions:{
        server: {
            create: require(__dirname+'/lib/actions/server/createServer.js'),
            listen: require(__dirname+'/lib/actions/server/listen.js')
        },
        client: {
            connect: require(__dirname+'/lib/actions/client/connect.js'),
            write: require(__dirname+'/lib/actions/client/write.js')
        }
    },
    pipes: {},
    init: function(fPipes){
        console.log('registering tcpPipes');
        fPipes.actions.register('TCP:Server:Create', this.actions.server.create);
        fPipes.actions.register('TCP:Server:Listen', this.actions.server.listen);
        fPipes.actions.register('TCP:Client:Connect', this.actions.client.connect);
        fPipes.actions.register('TCP:Client:Write', this.actions.client.write);

        //register a basic tcp server pipe
        var createServerPipe = new fPipes.pipe();
        createServerPipe.use(this.actions.server.create);
        createServerPipe.use(this.actions.server.listen);
        fPipes.pipes.register('TCP:Server:CreateAndListen', createServerPipe);
    }
};

module.exports = flux_pipes_tcp;