<template>
    <div>
<!------------------------ 轮播图 -------------------------->
        <!-- 参考：https://blog.csdn.net/weixin_46719229/article/details/119429090 -->
        <div 
            class="banner"
            @mouseenter="showSpan"
            @mouseleave="closeSpan"
        >
            <div class="b_img">
                <img 
                    v-for="b in banners"
                    :key="b.index"
                    :src="b.imageUrl"
                    alt="暂无图片"
                    v-show="b.index === currentIndex"
                >
            </div>
            <span class="left" v-show="isHover" @click="imgPre">
                <i class="iconfont">&#xe605;</i>
            </span>
            <span class="right" v-show="isHover" @click="imgNext">
                <i class="iconfont">&#xe606;</i>
            </span>
            <ul class="circle">
                <li 
                    v-for="b in banners" 
                    :key="b.index" 
                    :class="b.index === currentIndex? 'choose' : '' "
                    @click="changeIndex(b.index)"
                >
                </li>
            </ul>
        </div>
<!------------------------- 推荐歌单 ----------------------->
        <div class="list_rcmd">
            <div class="list_rcmd_title">
                <img src="../assets/image/我的推荐.png" alt="推荐">
                推荐歌单
            </div>
            <div class="list_rcmd_list">
                <span
                    class="item"
                    v-for="(p,index) in playlistRcmd"
                    :key="index"
                >
                    <img :src="p.picUrl" alt="歌单图片" @click="toListDetail(p.id)">
                    <a href="javascript:;" @click="toListDetail(p.id)">{{p.name}}</a>
                </span>
            </div>
        </div>

<!--------------------------- 新歌新碟 ------------------------>
        <div class="albums">
            <ul class="albums_title">
                <li>
                    <img src="../assets/image/我的推荐.png" alt="推荐">
                    新碟上架
                </li>
                <li><a href="javascript:;">华语</a></li>
                <li><a href="javascript:;">欧美</a></li>
                <li><a href="javascript:;">韩国</a></li>
                <li><a href="javascript:;">日本</a></li>
            </ul>
            <div class="albums_list">
                <span
                    class="item"
                    v-for="(a,index) in albumsRcmd"
                    :key="index"
                >
                    <img :src="a.picUrl" alt="专辑图片">
                    <p>{{a.name}}</p>
                    <span class="info" v-for="(art,index) in a.artists" :key="index">{{art.name}}</span>
                </span>
            </div>
        </div>
    
<!------------------------ 推荐新音乐 --------------------------------->
        <div class="song_rcmd">
            <div class="song_rcmd_title">
                <img src="../assets/image/我的推荐.png" alt="推荐">
                新歌推荐
            </div>
            <div class="song_rcmd_list">
                <span
                    class="item"
                    v-for="(s,index) in songRcmd"
                    :key="index"
                >
                    <img :src="s.picUrl" alt="歌曲图片">
                    <div class="info">
                        <p>{{s.name}}</p>
                        <span class="art" v-for="(art,index) in s.song.artists" :key="index">{{art.name}}</span>
                        <span class="album">{{s.song.album.type === 'Single' ? '单曲' : '专辑'}}:{{s.song.album.name}}</span>
                    </div>
                </span>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'HoemPage',
    data() {
        return {
            isHover: false,
            currentIndex: 0,
            timer:null,
            banners: [],
            playlistRcmd: [],
            songRcmd:[],
            albumsRcmd:[],
        }
    },
    methods: {
        // 去歌曲详情页面
        toListDetail(id) {
            this.$router.push({
                path: '/playlist',
                query: {
                    id,
                }
            })
        },





// ---------------------------------轮播图------------------------------------------
        // 鼠标经过banner时，图片左右切换按钮显示，清除定时器
        showSpan() {
            this.isHover = true
            clearInterval(this.timer)
        },
        // 离开时，图片左右切换按钮不显示，开启定时器
        closeSpan() {
            this.isHover = false
            this.startInterval()
        },
        // 图片向前
        imgPre() {
            if (this.currentIndex === 0) {
                this.currentIndex = this.banners.length - 1
            }else {
                this.currentIndex--
            }
        },
        // 图片向后
        imgNext() {
            if (this.currentIndex === this.banners.length - 1) {
                this.currentIndex = 0
            }else {
                this.currentIndex++
            }
        },
        // 点击小圆点切换图片
        changeIndex(index) {
            this.currentIndex = index
        },
        // 开启自动切换的定时器
        startInterval() {
            clearInterval(this.timer)
            this.timer = setInterval(() => {
                this.imgNext()
            },3000)
        }
    },
    created() {
        axios.get("https://netease-cloud-music-36zzgmzqx-suruan-eat.vercel.app/banner?type=0").then(
            response => {
                this.banners = response.data.banners
                let index = 0
                this.banners.forEach(item => {
                    item.index = index
                    index++
                })
            },
            error => {
                console.log(error);
            }
        )
        axios.get("https://netease-cloud-music-api-one-olive.vercel.app/personalized?limit=10").then(
            response => {
                this.playlistRcmd = response.data.result
            },
            error => {
                console.log(error);
            }
        )
        axios.get("https://netease-cloud-music-api-one-olive.vercel.app/album/new?area=ALL&limit=5").then(
            response => {
                this.albumsRcmd = response.data.albums
            },
            error => {
                console.log(error);
            }
        )
        axios.get("https://netease-cloud-music-api-one-olive.vercel.app/personalized/newsong?limit=10").then(
            response => {
                this.songRcmd = response.data.result
            },
            error => {
                console.log(error);
            }
        )
    },
    mounted() {
        this.startInterval()
    }
}
</script>

<style lang="less" scoped>
    @bannerWidth:800px;
    @bannerHeight:296px;
    @listItemWidth:140px;
    @listItemHeight:200px;
    @borderRadius:10px;
    * {
        margin: 0;
        padding: 0;
    }
    li {
        list-style: none;
    }
    a {
        text-decoration: none;
    }
// ----------------------------------轮播图-------------------------------------------
    .banner {
        position: relative;
        margin: 0 auto;
        width: @bannerWidth;
        height: @bannerHeight;
        // height: 296px;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        .b_img {
            float: left;
            width: 600%;
            img {
                width: @bannerWidth;
                border-radius: 10px;
            }
        }
        // 两个切换按钮
        span {
            display: block;
            position: absolute;
            // top: (296px - 60)/2; //？？？不生效，为什么啊
            top: 128px;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            background-color: rgba(94, 94, 94, 0.275);
            border-radius: 10px;
            i {
                font-size: 30px;
                color: rgb(246, 246, 246);
            }
            &:hover {
                background-color: rgba(94, 94, 94, 0.546);
                cursor: pointer;
            }
        }
        // 向前切换
        .left {
            left:15px;
        }
        // 向后切换
        .right {
            right: 15px;
        }
        // 底部小圆点
        .circle {
            position: absolute;
            margin: 0 auto;
            left: 43%;
            bottom: 10px;
            li {
                transition: all .3s;
                float: left;
                margin-right: 5px;
                width: 8px;
                height: 8px;
                background-color: rgba(169, 169, 169, 0.837);
                border-radius: 4px;
            }
            // 被选中的小圆点
            .choose {
                width: 15px;
                background-color: rgba(255, 255, 255, 0.864);
            }
        }

    }
// --------------------------------推荐歌单-------------------------------------------
    .list_rcmd {
        margin: 10px auto;
        width: @bannerWidth;
        .list_rcmd_title {
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 20px;
            font-weight: bold;
            border-bottom: 3px solid #000;
        }
        .list_rcmd_list {
            margin-top: 10px;
            width: 100%;
            height: 450px;
            background-color: pink;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-content: space-between;
            .item {
                /* margin-left: 20px;
                margin-right: 20px; */
                width: @listItemWidth;
                height: @listItemHeight;
                background-color: #fff;
                border-radius: @borderRadius;
                margin-bottom: 30px;
                img {
                    width: 100%;
                    border-radius: @borderRadius;
                    margin-bottom: 10px;
                }
            }
        }
    }

//-------------------------------------新碟上架----------------------------------------
    .albums {
        margin: 10px auto;
        width: @bannerWidth;
        .albums_title {
            width: 100%;
            height: 50px;
            line-height: 50px;
            border-bottom: 3px solid #000;
            li {
                float: left;
                width: 50px;
            }
            li:nth-child(1) {
                width: 150px;
                font-size: 20px;
                font-weight: bold;
            }
        }
        .albums_list {
            margin-top: 10px;
            width: 100%;
            height: @listItemHeight;
            background-color: pink;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-content: space-between;
            .item {
                width: @listItemWidth;
                height: 100%;
                background-color: #fff;
                border-radius: @borderRadius;
                img {
                    width: 100%;
                    border-radius: @borderRadius;
                }
                p {
                    margin-top: 10px;
                    // height: 32px;
                    overflow: hidden;
                    text-overflow:ellipsis;//溢出用省略号...显示
                    display:-webkit-box;//将对象作为弹性伸缩盒子模型显示。
                    -webkit-box-orient:vertical;//从上到下垂直 排列子元素（设置伸缩盒子的子元素排列方式）
                    -webkit-line-clamp:1; //表示显示的行数合上面两个属性，表示显示的行数

                }
                .info {
                    height: 20px;
                    margin-right: 5px;
                    color: grey;
                    font-size: 12px;
                }
            }
            
        }
    }

//----------------------------------新歌推荐-------------------------------------------
    .song_rcmd {
        margin: 10px auto;
        width: @bannerWidth;
        // padding-bottom: 70px;
        .song_rcmd_title {
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 20px;
            font-weight: bold;
            border-bottom: 3px solid #000;
        }
        .song_rcmd_list {
            margin-top: 10px;
            width: 100%;
            height: 400px;
            background-color: pink;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-content: space-between;
            .item {
                width: 47%;
                height: 19%;
                background-color: #fff;
                display: flex;
                align-items: center;
                img {
                    margin-left: 15px;
                    height: 80%;
                    border-radius: 5px;
                }
                .info {
                    box-sizing: border-box;
                    padding-left: 15px;
                    align-items: center;
                    p {
                        font-size: 16px;
                    }
                    span {
                        font-size: 12px;
                        color: grey;
                    }
                    .art {
                        padding-right: 5px;
                    }
                    .album {
                        display: block;
                    }
                }
            }
        }
    }


</style>