var mosca = require('mosca');

var settings = {
    database : {
        redis : {
            backend: {
                type: 'redis',
                redis: require('redis'),
                port: 15356,
                return_buffers: true, // to handle binary payloads
                host: "redis-15356.c11.us-east-1-2.ec2.cloud.redislabs.com",
                password: "kbDG1s4EyMaVbQ1Y7bCErLE2lQ0ciyvd"
            },
            persistence: {
                factory: mosca.persistence.Redis ,
                host:  "redis-15356.c11.us-east-1-2.ec2.cloud.redislabs.com",
                port: 15356,
                password: "kbDG1s4EyMaVbQ1Y7bCErLE2lQ0ciyvd"
            },
            http: {
                port: 1234,
                bundle: true,
                static: './'
            }
        }, 
        mongo : {
            backend: {
                type: 'mongo',
                url: "mongodb://localhost:27017/target",
                pubsubCollection: 'pubsub',
                mongo: {}
            },
            persistence: {
                factory: mosca.persistence.Mongo,
                url: "mongodb://localhost:27017/target"
            },
            http: {
                bundle: true,
                static: './'
            }
        },
        postgres : {
            user : 'azizahtas',
            password : 'azizahtas',
            database : 'smartrack',
            host : 'smart-rack.c7neg6roarnk.us-east-1.rds.amazonaws.com',
            port : 5432
        }
    }


}


module.exports = settings;