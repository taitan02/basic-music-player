const PLAYER_STORAGE_KEY = 'F8_player'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const playList = $('.playlist')
const progress = $('.progress')
const myProgress = $('.myprogress')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Memories',
            singer: 'Hanin Dhiya',
            path: './assets/music/memories.mp3',
            image: './assets/images/memories.jpg'
        },
        {
            name: 'Aloha',
            singer: 'Cool',
            path: './assets/music/Aloha-Cool.mp3',
            image: './assets/images/aloha.jpg'
        },
        {
            name: 'Non-fantasy',
            singer: 'LipXLip',
            path: './assets/music/Nonfantasy-LipXLip-5309100.mp3',
            image: './assets/images/nonfantasy.jpg'
        },
        {
            name: 'Best friend',
            singer: 'Nishino Kana',
            path: './assets/music/Best Friend.mp3',
            image: './assets/images/best friend.jpg'
        },
        {
            name: 'Secret base',
            singer: 'Kun',
            path: './assets/music/Secret Base.mp3',
            image: './assets/images/secret base.jpg'
        },
        {
            name: 'Về phía mưa',
            singer: 'Thế Bảo',
            path: './assets/music/Ve-Phia-Mua-The-Bao.mp3',
            image: './assets/images/vephiamua.jpg'
        },
        {
            name: 'Trời giấu trời mang đi',
            singer: 'Amee-Hoàng Dũng',
            path: './assets/music/Trời giấu trời mang đi.mp3',
            image: './assets/images/tgtmd.jpg'
        },
        {
            name: 'Something Just Like This',
            singer: 'The Chainsmokers-Coldplay',
            path: './assets/music/SomethingJustLikeThis.mp3',
            image: './assets/images/SomethingJustLikeThis.jpg'
        },
        {
            name: 'Hallelujah',
            singer: 'Pentatonix',
            path: './assets/music/Hallelujah.mp3',
            image: './assets/images/Pentatonix.jpg'
        },
        {
            name: 'Umbrella-remix',
            singer: 'Matte',
            path: './assets/music/Umbrella.mp3',
            image: './assets/images/Umbrella.jpg'
        },
        {
            name: 'Play date',
            singer: 'Melanie Martinez',
            path: './assets/music/playdate.mp3',
            image: './assets/images/playdate.jpg'
        },
        {
            name: 'Abcdefu',
            singer: 'Gayle',
            path: './assets/music/abcdefu.mp3',
            image: './assets/images/gayle.jpg'
        },
        {
            name: 'Warriors',
            singer: 'Imagine Dragons',
            path: './assets/music/Warriors.mp3',
            image: './assets/images/imagine dragon.jpg'
        },

    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return ` <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`})
        playList.innerHTML = htmls.join('')
        this.scrollToActiveSong()
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handle: function () {
        _this = this
        const cdWidth = cd.offsetWidth
        // Xử lý khi thu phóng
        document.onscroll = function () {
            const scroll = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scroll
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }

        //Xử lý đĩa nhạc quay
        var CdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ],
            {
                duration: 20000,
                iterations: Infinity

            })
        CdThumbAnimate.pause()
        //Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else { audio.play() }
        }
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            CdThumbAnimate.pause()
        }
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            CdThumbAnimate.play()
        }
        //Thanh progress chạy
        audio.ontimeupdate = function () {
            if (audio.duration) {   //Xét duration có phải NaN không
                const progressPercent = audio.currentTime / audio.duration * 100
                progress.value = progressPercent
                myProgress.value = progressPercent
            }
        }
        progress.oninput = function () {
            const seekTime = progress.value * audio.duration / 100
            audio.currentTime = seekTime
            myProgress.value = progress.value
        }
        //Khi nhấn next 
        nextBtn.onclick = function nextsong() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.currentIndex++
                if (_this.currentIndex >= _this.songs.length) {
                    _this.currentIndex = 0
                }
                _this.loadCurrentSong()
            }
            _this.setConfig('currentIndex', _this.currentIndex)
            _this.render()
            audio.play()
        }
        //Khi nhấn Prev
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.currentIndex--
                if (_this.currentIndex < 0) {
                    _this.currentIndex = _this.songs.length - 1
                }

                _this.loadCurrentSong()
            }
            _this.setConfig('currentIndex', _this.currentIndex)
            _this.render()
            audio.play()
        }
        //Khi nhấn repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
            if (_this.isRandom) {
                _this.isRandom = false
                randomBtn.classList.remove('active')
            }
            _this.setConfig('isRandom', _this.isRandom)
            _this.setConfig('isRepeat', _this.isRepeat)
        }
        //Khi nhấn random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            if (_this.isRepeat) {
                _this.isRepeat = false
                repeatBtn.classList.remove('active')
            }
            _this.setConfig('isRandom', _this.isRandom)
            _this.setConfig('isRepeat', _this.isRepeat)
        }
        //Xử lý khi audio ended
        audio.onended = function () {
            setTimeout(() => {
                if (_this.isRandom) {
                    _this.playRandomSong()

                } else if (_this.isRepeat) {
                    //Không làm gì hết
                } else {
                    _this.currentIndex++
                    _this.loadCurrentSong()
                }
                _this.setConfig('currentIndex', _this.currentIndex)
                _this.render()
                audio.play()
            }, 2000)

        }
        //Lắng nghe hành vi khi click vào playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            const optionNode = e.target.closest('.option')
            if (songNode && !optionNode) {
                // _this.currentIndex=playList.i
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
                // songNode.getAttribute('data-index')//cso thể dùng cách này để lấy index của song
            } else if (optionNode) {
                alert('Tính năng này chưa được làm')
            }
            _this.setConfig('currentIndex', _this.currentIndex)
        }
    },
    //scroll tới bài đang phát
    scrollToActiveSong: function () {
        const songLength = this.songs.length
        setTimeout(() => {
            if (this.currentIndex < songLength - 4 && this.currentIndex >= 3) {
                $('.song.active').scrollIntoView({
                    behavior: "smooth", block: "center"
                })
            } else if (this.currentIndex < 3) {
                $('.song.active').scrollIntoView({
                    behavior: "smooth", block: "end"
                })
            } else {
                $('.song.active').scrollIntoView({
                    behavior: "smooth", block: "nearest"
                })
            }
        }, 200)
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom || false
        this.isRepeat = this.config.isRepeat || false
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
        this.currentIndex = this.config.currentIndex || 0

    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    //XỬ lý songs khi bật mode phát ngẫu nhiên
    playRandomSong: function () {
        let newIndex = this.currentIndex
        do {
            this.currentIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === newIndex)
        this.loadCurrentSong()
    },
    start: function () {
        //Tải cấu hình lưu trong localStorage
        // this.loadConfig()
        //Đingh nghĩa các thuộc tính cho Object
        this.defineProperties()
        //Lắng nghe, xử lý các sự kiện (DOM event)
        this.handle()

        //Tải thông tin bài hát đầu tiên khi mở ứng dụng
        this.loadCurrentSong()
        //Render lại danh sách bài hát
        this.render()
    }
}
app.start()
