const Discord = require('discord.js');
const {
    prefix,
    token,
} = require('./config.json');
const ytdl = require('ytdl-core')

const client = new Discord.Client

const queue = new Map();

const songs = [
    "https://youtu.be/ohm5CVdutrw",
    "https://youtu.be/-279WY54YnI",
    "https://youtu.be/JntQ1X46qgg",
    "https://youtu.be/XspKmxaC9Tw",
    "https://youtu.be/OxLH0nnUnCY",
    "https://youtu.be/y4mPkze9AEs",
    "https://youtu.be/_aUO46NTkJk",
    "https://youtu.be/lQTQ4D19F4U",
    "https://youtu.be/5WcyVvWZJU4",
    "https://youtu.be/W8Rg1nJxzV0",
    "https://youtu.be/ds4gZ6pwg6U",
    "https://youtu.be/vTlMz4fXNc4",
    "https://youtu.be/sIx8rJxfarI",
    "https://youtu.be/Vc3ffItUtlc",
    "https://youtu.be/IgoCc0kGvW8",
    "https://youtu.be/h6m-EtfqQTo",
    "https://youtu.be/F-DGqMXCtCU",
    "https://youtu.be/n1rTZNqsaJU",
    "https://youtu.be/vgcj035vwXI",
    "https://youtu.be/TEaj8kIl8o4",
    "https://youtu.be/_F5BR0CuK6w",
    "https://youtu.be/I-2Jk7tMMps",
    "https://youtu.be/A8_C1J074cQ",
    "https://youtu.be/mhPHu_JipRg",
    "https://youtu.be/ojbT_p4kbdk",
    "https://youtu.be/59RIVbWC4oE",
    "https://youtu.be/vxL_r-0VC1k",
    "https://youtu.be/f84w1gEAXYQ",
    "https://youtu.be/yDWWryudg5k",
    "https://youtu.be/sftFzatlg4I",
    "https://youtu.be/fJFaQAnS2gc",
    "https://youtu.be/cypV1kvztXo",
    "https://youtu.be/gRuYTOP8B9I",
    "https://youtu.be/5JoOh7ZZovs",
    "https://youtu.be/Fha3nDNcp6U",
    "https://youtu.be/Sv3gOaniEBU",
    "https://youtu.be/we8MYuZ6fEQ",
    "https://youtu.be/t7yWN5Uiy-g",
    "https://youtu.be/LoBpEj10X8c",
    "https://youtu.be/_SUlc1ndFbQ",
    "https://youtu.be/AMCKd0QQmK4",
    "https://youtu.be/JraiX6gtQ7k",
    "https://youtu.be/Zua2ek_Ryn0",
    "https://youtu.be/4tC0Vnj79Es",
    "https://youtu.be/NWjozTNgBnU",
    "https://youtu.be/4AsPNn4vnzU",
    "https://youtu.be/rYHKtPE9edU",
    "https://youtu.be/RLWLN62ZFho",
    "https://youtu.be/VKt9_j1jf60",
    "https://youtu.be/bZ7Keyb6ZN4",
    "https://youtu.be/Zo7C-cZ5Eik",
    "https://youtu.be/uJNfHGNXGUw",
    "https://youtu.be/JjH_EiN1Md8",
    "https://youtu.be/-AFil1Vm2KY",
    "https://youtu.be/h5FIcJaMTXU",
    "https://youtu.be/UMsT9om7seE",
    "https://youtu.be/YVtzlkcW48M",
    "https://youtu.be/nZ3FvYYBniA",
    "https://youtu.be/tNufJ8m5KOw",
    "https://youtu.be/iyTuMb-jhkc",
    "https://youtu.be/7L2tr8oU1TY",
    "https://youtu.be/xtplrt6OQUo",
    "https://youtu.be/VXeIRsqqFbA",
    "https://youtu.be/1CbJc7L-KKw",
    "https://youtu.be/z1BRZg0GG0A",
    "https://youtu.be/MGzhKV8SVIk",
    "https://youtu.be/NNNJsd3q9oM",
    "https://youtu.be/1gIxuYuI3IQ",
    "https://youtu.be/tbZfGafiBoI",
    "https://youtu.be/RrBRM5lckoY",
    "https://youtu.be/D4sG-8yo9kA",
    "https://youtu.be/76MIEcqQoIA",
    "https://youtu.be/WxCu0YAE5gQ",
    "https://youtu.be/pA-bkXHgId0",
    "https://youtu.be/Ki5_XdOR7KE",
    "https://youtu.be/Lxr7jwqqnpw",
    "https://youtu.be/8XKba81lEPU",
    "https://youtu.be/BWpZcGHijnk",
    "https://youtu.be/Z35h6_4NV9k",
    "https://youtu.be/_3rbzlh3JHc"
];

client.once('ready', () => {
   console.log('Spinning up!'); 
});
client.once('reconnecting', () => {
   console.log('Ha! You\re too slow!');
});
client.once('disconnect', () => {
    console.log('Blasting off at Sonic speed!');
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    const serverQueue = queue.get(message.guild.id);
    
    if(message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)){
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)){
        stop(message, serverQueue);
        return;
    } else {
        message.channel.send('I\'ll make you eat those words!');
    }
});

async function execute(message, serverQueue) {
    const args = message.content.split(' ');
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('Whoa! You gotta be in a channel for me to play my tunes!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('Hey! I\'m not allowed in that channel! What\'s the big idea!');        
    }
    
    var url;
    for (var x of songs)
    {
        if (args[1] == x)
        {
            url = x;
        }
    }
    if (!url) url = songs[Math.floor(Math.random() * songs.length)];
    const songInfo = await ytdl.getInfo(url);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    };
    if (!serverQueue) {
        const queueContract = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        
        queue.set(message.guild.id, queueContract);
        
        queueContract.songs.push(song);
        
        try {
            var connection = await voiceChannel.join();
            queueContract.connection = connection;
            
            play(message.guild, queueContract.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`Nice! ${song.title} sounds sick! Can\'t wait to hear it!`);
    }
}

function skip(message, serverQueue) {
    if (!serverQueue) return message.channel.send('Hey, I\'m not even playing anything!');
    serverQueue.connection.dispatcher.end();
    message.channel.send('Ha! I\'m already on the next song!')
}

function stop(message, serverQueue) {
    message.channel.send('There\'s no stopping me, faker!');
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url))
    .on('finish', () => {
        console.log('Hey, that song was toooo slow! Play something faster!');
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    })
    .on('error', error => {
       console.error(error); 
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

client.login(token);