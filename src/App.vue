<!-- 
    bug1:
        无法通过点击button按钮控制音乐播放
        已发现原因，但是还没想明白
        。。。想明白了
    bug2:
        当未结束当前音乐时，直接点击下一首音乐，音乐未播放，仍然显示播放按钮
        这里直接把audio的自动播放功能开开了，暂时看不见这个bug（^-^）
    bug3（未解决）:
        拖动进度条时，拖得超过一定时间，拖动不起效
    bug4:
        当input框的search事件触发时，页面会跳转到search路由，但是多次搜索，会多次进行push当前路由路径操作；
        网上找到解决这个问题的方法，在router的index配置文件添加相关代码。
        然后出现了新的问题，当重复进行搜索时，url栏keyword改变，但是search页面不返回新的结果；
        这里采用了粗暴的解决方案：在getSongs方法push完之后，直接reload当前页面（不知道会不会有什么不好的后果。。。）
    bug5:
        当播放列表为空或仅有一首歌曲时，再次点击先前/向后切换音乐按钮，控制台会报错，页面没啥问题
        不报错了，但是当仅剩一首歌曲时，删不掉了
        解决了，当列表只剩最后一首的时候，暂停音乐并触发mutations里的clear_list方法
    bug6:
        当删除歌曲后，列表内的index值不会按照之前那样自增的形势，会打乱，而且会出现index值重复的现象
        不能继续用length长度来作为index值了
        解决了，当每次删除后，对播放列表重排，更新index
 -->
 <!-- 
    ？？？问题：
        这里有一个问题：网上查资料的时候发现，这种方法为浅拷贝，但是控制台发现重排时原数组playList没有改变，这是为什么
        的确是前拷贝。。。 (-_-)
        问题2：
        在实现css布局时，想让container占满窗口，但是实现后，要不是其他界面不能占满，要不是home界面超出窗口部分container不随着home的高度变化
        现在暂时的解决方案就是把container_right改为scroll了（这里还解决了左侧侧边栏不能固定的问题）

  -->
 <!-- 
    一个感觉需要优化的点：
        本来应该在将当前歌曲添加到播放列表的时候，直接把歌曲url传过去，
        但这里后台获取歌曲的地址和歌曲详情不在一个路径里，就没有这样做，
        而是再次调用了axios（而不是直接从播放列表的的歌曲url值获取）来获得当前id下的歌曲url，
        感觉这样不太好，暂时不知道咋优化
        同样，在切换上下歌曲的时候也是在不停的进行axios获取url
  -->
<template>
    <div id="root">
        <div class="header">
            <!-- logo -->
            <span class="logo">
                <img src="./assets/image/yinle.png" alt="logo">
                <p>SuRo</p>
            </span>
            <!-- 查找框 -->
            <span class="inp_search">
                <el-input
                    :placeholder="showKeyword"
                    v-model="keyword" 
                    @keyup.enter.native="getSongs"
                    clearable
                    >
                </el-input>
            </span>
        </div>
        <div class="container">
            <span class="con_left">
                
                <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    :router="true" 
                >
                    <el-submenu index="findMusic">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>发现音乐</span>
                        </template>
                        <el-menu-item-group>
                        <!-- <template slot="title">分组一</template> -->
                            <el-menu-item index="1-1" route="/home">
                                推荐
                            </el-menu-item>
                            <el-menu-item index="1-2">排行榜</el-menu-item>
                            <el-menu-item index="1-3">歌单</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item index="myMusic">
                        <i class="el-icon-menu"></i>
                        <span slot="title">我的音乐</span>
                    </el-menu-item>
                    <!-- <el-menu-item index="3">
                        <i class="el-icon-document"></i>
                        <span slot="title">导航三</span>
                    </el-menu-item> -->
                    <!-- <el-menu-item index="4" disabled>
                        <i class="el-icon-setting"></i>
                        <span slot="title">导航四</span>
                    </el-menu-item> -->
                </el-menu>
                    
            </span>
            <span class="con_right">
                <!-- 展示路由页面 -->
                <router-view></router-view>
            </span>
        </div>
        <div class="footer">
            <!-- 音频 -->
            <!-- 参考网址：https://segmentfault.com/a/1190000012453975 -->
            <!-- https://blog.csdn.net/weixin_49452182/article/details/107410934 -->
            <audio
                ref="audio"
                autoplay
                :src="songUrl"
                @pause="onPause"
                @play="onPlay"
                @timeupdate="onTimeupdate"
                @loadedmetadata="onLoadedmetadata"
                @ended="musicEnded"
            >
            </audio>
            <!-- 音乐播放测试test -->
            <!-- <audio
                ref="audio"
                autoplay
                src="./assets/music/Hugme.mp3"
                @pause="onPause"
                @play="onPlay"
                @timeupdate="onTimeupdate"
                @loadedmetadata="onLoadedmetadata"
            >
            </audio> -->
            <!-- 控制音乐播放以及切换上下歌曲 -->
            <span class="controler">
                <button class="c_pre" @click="listPre"></button>
                <!-- 点击切换为播放-->
                <button class="c_pause" @click="play" v-show="!audio.playing"></button>
                <!-- 点击切换为暂停 -->
                <button class="c_play" @click="pause" v-show="audio.playing"></button>
                <button class="c_next" @click="listNext"></button>
            </span>
            <!-- 当前音乐图片 -->
            <span class="f_img">
                <img :src="songImgUrl" alt="image">
            </span>
            <!-- 控制音乐进度 -->
            <span class="f_progress_rate">
                <!-- 音乐名称、歌手 -->
                <span class="p_song">
                    <span>{{songName}}</span>
                    <span>{{songArtist}}</span>
                </span>
                <!-- 进度条 -->
                <span class="p_bar">
                    <el-slider 
                        v-model="audio.currentTime"
                        @change="progressChange"
                        :format-tooltip="realFormatSecond"
          	            :max="audio.maxTime"
                    >
                    </el-slider>
                </span>
                <!-- 进度时间 -->
                <span class="p_timer">
                    <p>
                        {{audio.currentTime | formatSecond}}/{{audio.maxTime | formatSecond}}
                    </p>
                </span>
            </span>
            <!-- 播放模式 -->
            <span class="f_playmode" @click="changePlayMode">
                <a href="javascript:;" v-show="mode === 0"><img src="./assets/image/列表循环.png" alt="列表循环" width="100%"></a>
                <a href="javascript:;" v-show="mode === 1"><img src="./assets/image/单曲循环.png" alt="单曲循环" width="100%"></a>
                <a href="javascript:;" v-show="mode === 2"><img src="./assets/image/随机播放.png" alt="随机播放" width="100%"></a>
            </span>
            <!-- 播放列表 -->
            <span class="f_songs_list">
                <!-- 列表图标，控制播放列表的展示与否 -->
                <a href="javascript:;" @click="listShow">
                    <img src="./assets/image/列表.png" alt="播放列表" width="100%">
                </a>
                <div class="song_list_box" v-show="listIsShow">
                    <ul>
                        <li v-for="p in playList" :key="p.id">
                            <a href="javascript:;" @click="playSong({ id:p.id,isADD:false,isPlay:true })">
                                <img src="./assets/image/icon_听音乐.png" alt="播放" width="16px">
                            </a>
                            {{p.name}}||{{p.artist}}
                            <a href="javascript:;" @click="deleteSong(p.id)">
                                <img src="./assets/image/删除列表歌曲.png" alt="删除" width="16px">
                            </a>
                        </li>
                    </ul>
                </div>
            </span>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapState,mapActions } from 'vuex';
// second从过滤器获得
function realFormatSecond(second) {
    var secondType = typeof second;

    if (secondType === 'number' || secondType === 'string') {
      second = parseInt(second);

      var hours = Math.floor(second / 3600);
      second = second - hours * 3600;
      var mimute = Math.floor(second / 60);
      second = second - mimute * 60;

      return ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
      return '00:00'
    }
}

export default {
    name: 'App',
    components: {}, 
    data() {
        return {
            showKeyword: '',
            realkeyword:'',
            keyword: '',
            list: JSON.parse(localStorage.getItem('playList')) || [],
            audio: {
                playing: false,
                currentTime: 0,
                maxTime:0,
            },
            cacheCurrent: 0,
            listIsShow: false,
            // 音乐播放模式
            mode: 0,
            playMode: {
                sequence: 0,
                loop: 1,
                random: 2
            }
        }
    },
    computed: {
        ...mapState(['songUrl', 'songName', 'songArtist', 'songImgUrl', 'playList']),
        playlistChange() {
            // 获取playList数据
            return this.playList
        }
    },
    watch: {
        /* 本来想用watch来监视playList内的数据，但是不知道咋获取，直接this.playList会报错
        查找资料（https://www.lmlphp.com/user/16548/article/item/548847/），在计算属性中得到palyList，监视这个计算属性就好了^-^ */
        playlistChange: {
            // 监视playList变化
            deep: true,
            handler(val) {
                this.list = val
                localStorage.setItem('playList',JSON.stringify(val))
            }
        }
    },
    methods: {
        ...mapActions({ playSong: 'getSongUrl'}),
        // ...mapMutations({ deleteSong: 'DELETE_SONG' }),
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        // 获取搜索到的歌曲
        // 跳转到搜索到的歌曲列表界面
        getSongs() {
            if (this.keyword === '') {
                this.keyword = this.realkeyword
            }
            this.$router.push({
                path: '/search',
                query: {
                    keyword: this.keyword,
                }
            })
            window.location.reload()
            
        },
        //展示或关闭播放列表
        listShow() {
            this.listIsShow = !this.listIsShow
        },
        // 删除播放列表歌曲
        deleteSong(id) {
            // 只有一首歌曲时，为了防止再次触发下一首操作，需要判断当前列表有多少歌曲
            // 如果超过一首，则删除选中id的歌曲；
            if (this.$store.state.playList.length > 1) {
                if (id === this.$store.state.songId) {
                    this.listNext()
                }
                this.$store.commit('DELETE_SONG',id)
            } else {
            // 如果只有一首，则直接执行清空列表操作
                this.pause()
                this.$store.commit('CLEAR_LIST')
                this.audio.playing = false
            }

        },
// ----------------------改变播放循环模式-------------------------
        // 参考：https://www.cnblogs.com/Small-Windmill/p/14702411.html
        // 当歌曲结束时，自动播放下一首或者单曲循环
        musicEnded() {
            // 当播放列表只有一首歌曲时，相当于对歌曲循环播放
            if (this.list.length < 2) {
                this.loop()
            } else {
                if (this.mode === this.playMode.loop) {
                    this.loop()
                } else {
                    this.listNext()
                }
            }
        },
        loop() {
            this.$refs.audio.currentTime = 0
            this.play()
        },
        /* 这里大致想法：
            首先，在app组件里新增了一个list属性，默认读取vuex里的playList值
            当mode===0时，依旧读取playList值，也就是默认值
            当mode===2时，读取randomList值，也就是打乱顺序后的值
            所以，切换下一首和上一首时，next和pre函数读取的应该时app里的list属性，记得改一下
        注：audio提供了end属性，当这首歌曲结束时，触发end里的函数 */
         /* ！！！注意：这里有一个坑，当你将playList值赋给list时（这两个数组指向的地址还是一个地址），直接对list进行重排，会导致Vuex里的playlist跟着变化
         需要对playList进行创建数组副本（深拷贝
         参考：
            https://www.5axxw.com/questions/content/ziri67   标题：当我尝试使用组件中的方法更改数据时，为什么我的vuex存储状态更改？
            https://blog.csdn.net/am_xiao_hui/article/details/116764106   标题：JavaScript-函数式编程-创建数组副本 */
        changePlayMode() {
            this.mode = (this.mode + 1) % 3
            // this.sequenceList = [...this.playList]
            // ？？？这里有一个问题：网上查资料的时候发现，这种方法（扩展运算符）为浅拷贝，但是控制台发现重排时原数组playList没有改变，这是为什么
            // 发现了，index和之前不一致，但列表的顺序没变。大概是先random后，顺序本来改变了，重排后index也改变了，但是展示出来的列表还是按原顺序，所以index顺序不对
            // 改成下面这种深拷贝就没问题了
            let list = JSON.parse(JSON.stringify(this.playList))
            if (this.mode === this.playMode.random) {
                // 当前为随机播放
                this.list = this.randomPlayList(list)
            } else {
                // 当前为单曲循环或顺序播放模式  
                this.list = list
            }
        },
        // 打乱播放列表顺序
        randomPlayList(arr) {
            for (let i = 0; i < arr.length; i++){
                let randomIndex = Math.floor(Math.random() * arr.length)
                let song = arr[i]
                arr[i] = arr[randomIndex]
                arr[randomIndex] = song
            }
            let j = arr.length - 1
            arr.forEach(item => {
                item.index = j
                j--
            })
            console.log('arr',arr);
            return arr
        },
 // -----------------------------底部音乐控制-----------------------------
        // 获取dom节点的audio，控制其播放/暂停
        play() {
            this.$refs.audio.play()
        },
        pause() {
            this.$refs.audio.pause()
        },
        // 控制播放/暂停切换
        onPlay() {
            this.audio.playing = true
        },
        onPause() {
            this.audio.playing = false
        },
        // 切换播放列表下一首
        /* 奇怪的bug：
            当切换为随机模式后切换顺序模式，这里读取的还是playList时，播放下一首按照的时random后的歌曲，但是查看控制台playList还是顺序播放下的列表 */
        listNext() {
            console.log(this.list);
            if (this.list.length > 0) {
                console.log('next触发');
                // 在播放列表中找到当前播放的音乐的index索引值
                let playIndex = 0;
                this.list.forEach(item => {
                    if (item.id === this.$store.state.songId)
                        playIndex = item.index
                })
                console.log(playIndex);
                // 像后播放则index-1；如果为最后一首歌则播放列表第一首
                if (playIndex > 0) {
                    playIndex = playIndex - 1;
                } else {
                    playIndex = this.list.length - 1
                }
                console.log(playIndex);
                // 查找当前index下的歌曲的id
                let playId = 0;
                this.list.forEach(item => {
                    if (item.index === playIndex)
                        playId = item.id
                })
                console.log(playId);
                this.$store.dispatch('getSongUrl', { id:playId,isADD:false,isPlay:true })
            }
        },
        // 切换播放列表上一首
        listPre() {
            if (this.list.length > 0) {
                // 在播放列表中找到当前播放的音乐的index索引值
                let playIndex = 0;
                this.list.forEach(item => {
                    if (item.id === this.$store.state.songId)
                        playIndex = item.index
                })
                console.log(playIndex);
                // 像前播放则index+1；如果为第一首歌则播放列表最后一首
                if (playIndex < this.list.length - 1) {
                    playIndex = playIndex + 1;
                } else {
                    playIndex = 0
                }
                console.log(playIndex);
                // 查找当前index下的歌曲的id
                let playId = 0;
                this.list.forEach(item => {
                    if (item.index === playIndex)
                        playId = item.id
                })
                console.log(playId);
                this.$store.dispatch('getSongUrl',{ id:playId,isADD:false,isPlay:true })
            } 
        },
        // 拖动进度滚动条
        progressChange() {
            // console.log('拖动滚动条触发', this.cacheCurrent);
            // 控制从dom节点获取的audio内的音乐进度
            this.$refs.audio.currentTime = this.cacheCurrent;
            // 控制data内的当前音乐进度
            this.audio.currentTime = this.cacheCurrent
        },
        // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
        onTimeupdate(e) {
        // 0,0.1,0.2,...1,1.1,...2,...10
            this.audio.currentTime = e.target.currentTime
        },
        // 获取音频长度
        onLoadedmetadata(e) {
            this.audio.maxTime = parseInt(e.target.duration)
        },
        realFormatSecond(second) {
            // console.log('自动播放触发', second);
            this.cacheCurrent = second;
            return realFormatSecond(second);
        },
    },
    filters: {
        // 将整数转化成时分秒
        formatSecond(second = 0) {
            return realFormatSecond(second)
        }
    },
    beforeCreate() {
        axios.get("https://netease-cloud-music-api-one-olive.vercel.app/search/default").then(
            response => {
                this.showKeyword = response.data.data.showKeyword
                this.realkeyword = response.data.data.realkeyword
            },
            error => {
                console.log(error);
            }
        )
    }
}
</script>

<style lang="less" scoped>
    /deep/ .el-input {
        width: 300px;
    }
    /deep/ .el-input__inner {
        background: #fff url(./assets/image/查找.png) no-repeat 2% 50%;
        text-indent: 4rem;
        width: 300px;
        height: 36px;
        border-radius: 16px;
        border: 1px solid rgb(187, 186, 186);
        outline: none;
    }
    /deep/ .el-input__suffix {
        top:-1px;
    }
    /deep/ .el-menu{
        height: 100%;
    }
</style>

<style lang="less">
    * {
        margin: 0;
        padding: 0;
    }
    li {
        list-style: none;
    }
/*     html, body {
        width: 100%;
        height: 100%;
    } */
    body {
        background-color: pink;
    }
    #root {
        display: flex;
/*         width: 100%;
        height: 100%; */
        width:100vw;
	    height:100vh;
    }
    /* ----------------------------------------头部--------------------------------------- */
    .header {
        position: fixed;
        top: 0;
        background-color: red;
        width: 100%;
        height: 50px;
        display: flex;
        z-index: 99;
    }
    .header .logo {
        /* position: fixed; */
        width: 200px;
        background-color: rgb(195, 255, 192);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
    }
    .header .logo img {
        width: 30px;
        height: 30px;
    }
    .header .logo p {
        margin: 0 0 0 5px;
        /* background-color: #fff; */
        font-weight: 600;
        font-size: 30px;
        font-family: 'Courier New', Courier, monospace;

    }
    .header .inp_search {
        background: skyblue;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* ------------------------------------版心界面--------------------------------------- */
    .container {
        padding: 0;
        background-color: blue;
        margin-top: 50px;
        /* height: 2000px; */
        width: 100%;
        flex:1;
        display: flex;
        justify-content: space-between;
    }
    .container .con_left {
        width: 200px;
        height: 100%;
        background-color: #fff;
        flex-shrink: 0;
    }
    .container .con_right {
        flex: 1;
        padding-bottom: 70px;
        height: 100%;
        background-color: #ccc;
        overflow: scroll;
    }

    /* -------------------------------------底部----------------------------------------- */
    .footer {
        position: fixed;
        bottom: 0;
        background-color: green;
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99;
    }
    /* 。。。播放控制按钮。。。 */
    .footer .controler {
        width: 120px;
        height: 40px;
        background-color: #fff;
        margin-right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .footer .controler button {
        margin-left: 2px;
        margin-right: 2px;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        border: 2px solid rgb(108, 108, 108);
    }
    .footer .controler .c_pre {
        background: #ccc url(./assets/image/上一首.png) no-repeat 50% 50%;
        background-size: 50%;
    }
    .footer .controler .c_pause {
        width: 36px;
        height: 36px;
        border-radius: 20px;
        border: 2px solid rgb(108, 108, 108);
        background: #ccc url(./assets/image/暂停.png) no-repeat 66% 50%;
        background-size: 60%;
    }
    .footer .controler .c_play {
        width: 36px;
        height: 36px;
        border-radius: 20px;
        border: 2px solid rgb(108, 108, 108);
        background: #ccc url(./assets/image/播放.png) no-repeat 50% 50%;
        background-size: 60%;
    }
    .footer .controler .c_next {
        background: #ccc url(./assets/image/下一首.png) no-repeat 50% 50%;
        background-size: 50%;
    }
    /* 。。。音乐图片。。。 */
    .footer .f_img {
        height: 60px;
        width: 60px;
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;

    }
    .footer .f_img img {
        width: 100%;
        height: 100%;
    }
    /* 。。。播放进度。。。 */
    .footer .f_progress_rate {
        margin-left: 10px;
        height: 60px;
        width: 600px;
        background-color: rgb(174, 214, 93);
        display: flex;
        flex-shrink: 0;
        flex-wrap: wrap;
        align-content: space-between;
    }
    .footer .f_progress_rate .p_song {
        width: 100%;
        height: 20px;
        background-color: skyblue;
        font-size: 12px;
        span:first-child {
            font-size: 14px;
            padding-right: 10px;
        }
    }
    .footer .f_progress_rate .p_bar {
       background-color: #fff;
        height: 40px;
        width: 85%;
    }
    .footer .f_progress_rate .p_timer {
        height: 40px;
        width: 15%;
        font-size: 13px;
        color: rgb(144, 144, 144);
        text-align: center;
        line-height: 40px;
        flex: 1;
        background-color: pink;
    }
    /* 。。。播放列表。。。 */
    .footer .f_songs_list {
        position: relative;
        margin-left: 10px;
        width: 24px;
        height: 24px;
        background-color: rgb(111, 111, 111);
    }
    .footer .f_songs_list .song_list_box {
        position: absolute;
        top: -223px; /* footer的高度/2 - f_songs_list的高度/2 + song_list_box的高度 */
        left: -68px; /* song_list_box的宽度/2 - f_songs_list的宽度/2 */
        width: 160px;
        height: 200px;
        background-color: orange;
        border-radius: 5px;
        overflow: scroll;
    }
    .footer .f_songs_list .song_list_box li {
        width: 100%;
        background-color: #fff;
        border-bottom: 1px solid #000;
        border-radius: 5px;
    }
    /* 。。。播放模式。。。 */
    .footer .f_playmode {
        margin-left: 10px;
        width: 24px;
        height: 24px;
        background-color: rgb(111, 111, 111);
    }
</style>