import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

const actions = {
    // 获取歌曲播放地址
    getSongUrl(context, val) {
        axios.get("https://netease-cloud-music-36zzgmzqx-suruan-eat.vercel.app/song/url?id=" + val.id).then(
            response => {

                context.commit('GET_SONGURL', {
                    songUrl: response.data.data[0].url
                })
            },
            error => {
                console.log(error);
            }
        )
        context.dispatch('getSongDetail', val)
    },
    // 获取歌曲详细信息
    getSongDetail(context, val) {
        axios.get("https://netease-cloud-music-36zzgmzqx-suruan-eat.vercel.app/song/detail?ids=" + val.id).then(
            response => {
                const details = {
                    id: val.id,
                    name: response.data.songs[0].name,
                    artist: response.data.songs[0].ar[0].name,
                    imgUrl: response.data.songs[0].al.picUrl,
                }
                if (val.isADD) {
                    context.commit('ADD_SONG', details)
                }
                if (val.isPlay) {
                    context.commit('UPDATE_SONGDETAIL', details)
                }
            },
            error => {
                console.log(error);
            }
        )
    },
    //将当前歌曲添加到播放列表（不播放）
    /* 这里可以优化：
    因为点击播放且添加当前歌曲时，需要执行两次重复的axios操作，浪费资源，没必要
        可以在getSongDetail的接收参数中添加isADD属性，如果需要添加，再执行add_song操作 */
    addSong(context, val) {
        context.dispatch('getSongDetail', val)
    }

}

const mutations = {
    GET_SONGURL(state, value) {
        // console.log(value);
        state.songUrl = value.songUrl
    },
    // 获取当前播放歌曲的信息
    UPDATE_SONGDETAIL(state, value) {
        state.songId = value.id
        state.songName = value.name
        state.songArtist = value.artist
        state.songImgUrl = value.imgUrl
    },
    ADD_SONG(state, value) {
        const playItem = {
            id: value.id,
            name: value.name,
            artist: value.artist,
            index: state.playList.length
        }
        // id是否重复
        let isRepeat = false
        // 遍历playList列表，如果id没有重复，则添加该记录
        state.playList.forEach(item => {
            if (item.id === playItem.id)
                isRepeat = true
        })
        if (!isRepeat) {
            state.playList.unshift(playItem)
        }
        // console.log(state.playList);
    },
    DELETE_SONG(state, id) {
        console.log('DELETE_SONG触发');
        state.playList = state.playList.filter(item => {
            return item.id !== id
        })
        // 当删除歌曲时，index顺序会改变，不再按照之前依次倒叙排列
        // 因此需要对数组内的每个对象的index值重新排序赋值，这样最后的歌曲顺序才是依次按顺序排列
        let i = state.playList.length - 1
        state.playList.forEach(item => {
            item.index = i
            i--
        })
    },
    CLEAR_LIST(state) {
        state.songId = ''
        state.songUrl = ''
        state.songName = ''
        state.songArtist = ''
        state.songImgUrl = ''
        state.playList = []
    },
}

const state = {
    songId: '',
    songUrl: '',
    songName: '',
    songArtist: '',
    songImgUrl: 'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
    playList: JSON.parse(localStorage.getItem('playList')) || [],
}

/* const getters = {

} */

export default new Vuex.Store({
    actions,
    mutations,
    state
})