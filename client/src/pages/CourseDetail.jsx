import React from 'react'

function CourseDetail() {
  return (
    <div>
      <main>
        <section className="course-details-area pt-150 pb-120 pt-md-100 pb-md-70 pt-xs-100 pb-xs-70">
          <div className="container p-8">
            <div className="row">
              {/* Video Section */}
              <div className="col-xxl-8 col-xl-7">
                <div className="courses-details-wrapper mb-60">
                  <div 
                    className="course-details-img mb-30" 
                    style={{backgroundImage: "url(assets/img/course/details/01.jpg)"}}>
                    <div className="video-wrapper">
                      <a href="https://www.youtube.com/watch?v=7omGYwdcS04" className="popup-video">
                        <i className="fas fa-play"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assets Section */}
              <div className="col-xxl-4 col-xl-5">
                <div className="learn-area mb-30">
                  <div className="learn-box">
                    <h5>Included Assets 📚</h5>
                    <ul className="learn-list">
                      <li>
                        <a href="#">
                          <span className="play-video">
                            <img src="assets/img/icon/video-player.svg" alt="course-list"/>
                          </span>
                          Free Youtube Videos
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span className="play-video">
                            <i className="fal fa-lock-alt"></i>
                          </span>
                          Animative notes used
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span className="play-video">
                            <i className="fal fa-lock-alt"></i>
                          </span>
                          Recall sheets
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span className="play-video">
                            <i className="fal fa-lock-alt"></i>
                          </span>
                          Practice questions split in 3 levels
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span className="play-video">
                            <i className="fal fa-lock-alt"></i>
                          </span>
                          Full Syllabus test
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span className="play-video">
                            <i className="fal fa-lock-alt"></i>
                          </span>
                          Audio Podcast Of Chapters
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span className="play-video">
                            <i className="fal fa-lock-alt"></i>
                          </span>
                          Simulations
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span className="play-video">
                            <i className="fal fa-lock-alt"></i>
                          </span>
                          Lifetime Access
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Info Section */}
            <div className="row">
              <div className="col-12">
                <h2 className="courses-title mb-30">Vision</h2>
                <p>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed di nonumy eirmod tempor invidunt ut labore et dolore magn aliq erat.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed di nonumy eirmod tempor invidunt ut labore et dolore magn aliq erat.
                </p>
                <h5 className="mt-20 mb-20">
                  <span>Created by</span> Instruct team
                </h5>
                <div className="date-lang">
                  <span><b>Language:</b> Hinglish</span>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="row">
              <div className="col-xl-6 col-lg-7">
                <div className="project-details mt-35">
                  <ul className="cart-list-tag d-sm-inline-flex align-items-center mb-15">
                    <li>
                      <div className="price-list">
                        <h5>
                          <span>₹1999</span>
                          <b className="sub-title">₹999 🎉</b>
                        </h5>
                      </div>
                    </li>
                  </ul>
                  <div className="cart-btn">
                    <a className="offer_btn" href="Vision.html">
                      Buy Now 🎓
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default CourseDetail