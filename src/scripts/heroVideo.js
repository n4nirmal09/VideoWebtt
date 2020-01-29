(function() {
	'use strict'


	class HeroVideo {
	  constructor(elem, options) {
	    this.container = elem
	    this.video = this.container.querySelector('video')
	    this.track = this.container.querySelector('track')
	    this.nav = this.container.querySelector('#hero-nav')
	    this.bar = null
	    this.thumbnail = null
	    this.options =  Object.assign({}, HeroVideo.defaults, options)
	    this.videoPercentage = null,
	    this.sortedC = [],
	    this.activeChapter = 0,
	    this.clickTransition = false,
	    this.intervalLoop = null

	    this.init()
	  }
	  
	  init() {
	    this.navBuilder()
	    this.barBuilder()
	    this.listeners()
	    
	    //this.thumbnailBuilder() // this requires thumbnailasset and updated vtt
	  }

	  barBuilder() {
	  	this.bar = document.createElement("div")
		this.bar.classList.add('hero__bar')
		this.container.appendChild(this.bar)
	  }

	  navBuilder() {
	  	
	  	this.track.addEventListener('load',() => {
	  		
		    let c = this.video.textTracks[0].cues
		    
		    
		    for (let i=0; i<c.length; i++) {
		    	
		    	if(parseInt(c[i].id) !== 0) this.sortedC.push(c[i])
		    }

		    this.sortedC.sort((a, b) => a.id - b.id)

		    for (let i=0; i<this.sortedC.length; i++) {
		    	let s = document.createElement("span");
			    s.innerHTML = this.sortedC[i].text;
			    s.setAttribute('data-start',this.sortedC[i].startTime)
			    s.setAttribute('data-index',i);
			    s.addEventListener("click",() => {
			      this.clickTransition = true
			      this.seek(false, this.sortedC[i].startTime)
			      this.clickTransition = false
			    });
			    this.nav.appendChild(s);
		    }
		    this.play()
		})
	  }

	  thumbnailBuilder() {
	  	this.thumbnail = document.createElement("div")
		this.thumbnail.classList.add('hero__thumbnail')
		this.nav.appendChild(this.thumbnail)
	  	
	  }

	  thumbnailMouseMove(e) {
	  	let p = (e.pageX-this.container.offsetLeft) * this.video.duration / this.container.getBoundingClientRect().width,
        c = this.video.textTracks[0].cues
        

        for (let i=0; i<c.length; i++) {
		    if(c[i].startTime <= p && c[i].endTime > p) {
		        break;
		    }
		    let url =c[i].text.split('#')[0],
		    xywh = c[i].text.substr(c[i].text.indexOf("=")+1).split(',')
		    this.thumbnail.style.backgroundImage = 'url('+c[i].text.split('#')[0]+')'
			this.thumbnail.style.backgroundPosition = '-'+xywh[0]+'px -'+xywh[1]+'px'
			this.thumbnail.style.left = e.pageX - xywh[2]/2+'px'
			this.thumbnail.style.top = this.nav.offsetTop - xywh[3]+8+'px'
			this.thumbnail.style.width = xywh[2]+'px'
			this.thumbnail.style.height = xywh[3]+'px'
		}
	  }

	  seek(e, d) {
	  	if(this.intervalLoop) {
	  		clearTimeout(this.intervalLoop)
	  		this.intervalLoop = null
	  	}
	  	
	  	let duration = null 
	  	if(d !== undefined) {
	  		duration = d + 0.0001
	  	} else {
	  		duration = (e.pageX-this.container.offsetLeft) * this.video.duration / this.container.getBoundingClientRect().width
	  	}




	  	
	  	this.video.currentTime = duration
	  	this.activeChapterChanger()
	  	console.log(this.sortedC[this.activeChapter].endTime - this.video.currentTime)

	  	this.intervalLoop = setTimeout(() => {
 			this.activeChapter = this.activeChapter < this.sortedC.length - 1 ? this.activeChapter + 1 : 0
 			this.play()
 		}, (this.sortedC[this.activeChapter].endTime - this.video.currentTime + 1) * 1000 )


    	if(this.video.paused) { this.video.play(); }
	  }

	  play() {
	  	this.seek(false, this.sortedC[this.activeChapter].startTime)
	    //if(this.video.paused) { this.video.play(); } else { this.video.pause() }
	  }

	  update() {

	    this.videoPercentage = this.video.currentTime/this.video.duration*100

	    this.bar.style.background = "linear-gradient(to right, #500 "+this.videoPercentage+"%, #000 "+this.videoPercentage+"%)"
	    
	  }

	  activeChapterChanger() {

	  	const currentC = this.sortedC.find(c => {
	  		return this.video.currentTime >= c.startTime  && this.video.currentTime <= c.endTime
	  	})

	  	if(currentC) this.activeChapter = this.sortedC.indexOf(currentC)

	  	
	  }


	  listeners() {
	  	// this.nav.addEventListener('mousemove', (e) => {
	  	// 	this.thumbnailMouseMove(e)
	  	// })
	  	this.video.addEventListener('click', () => {
	  		this.play()
	  	}, false)

	  	this.video.addEventListener('timeupdate', () => {
	  		this.update()
	  		//this.activeChapterChanger()
	  	}, false)

	  	this.bar.addEventListener('click', (e) => {
	  	   this.seek(e)
	  	}, false)
	  }
	}

	HeroVideo.defaults = {
		// default options
	}


	new HeroVideo(document.querySelector('#hero-banner'))

})()