import React from 'react'

function HomePage() {
    return (
        <>
            <main>
                <section class="slider-area pt-180 pt-xs-150 pt-150 pb-xs-35">
                    <img class="sl-shape shape_01" src="./assets/img/icon/01.svg" alt="" />
                    <img class="sl-shape shape_02" src="assets/img/icon/puzzle.svg" alt="" />
                    <img class="sl-shape shape_03" src="assets/img/icon/03.svg" alt="/" />
                    <img class="sl-shape shape_04" src="assets/img/icon/04.svg" alt="" />
                    <img class="sl-shape shape_05" src="assets/img/icon/05.svg" alt="" />
                    <img class="sl-shape shape_06" src="assets/img/icon/puzzle.svg" alt="/" />
                    <img class="sl-shape shape_07" src="assets/img/shape/dot-box-5.svg" alt="" />
                    <div class="main-slider pt-10">
                        <div class="container">
                            <div class="row align-items-center">
                                <div class="col-xl-6 col-lg-6 order-last order-lg-first">
                                    <div class="slider__img__box mb-50 pr-30">
                                        <video class="img-one mt-150 pr-0 " id="videop" src="assets/img/video/4K_Render (1).webm" muted loop autoplay playsinline>
                                            Your browser does not support.
                                        </video>

                                        {/* <!-- <img class="slide-shape chose-img-one" src="assets/img/slider/01.png" alt=""> --> */}
                                        <img class="slide-shape img-two" src="../assets/img/icon/dot-plan-1.svg" alt="" />
                                        <img class="slide-shape img-three" src="./assets/img/shape/target.svg" alt="" />
                                        <img class="slide-shape img-four" src="./assets/img/shape/dot-box-1.svg" alt="" />
                                        <img class="slide-shape img-five" src="./assets/img/shape/dot-box-2.svg" alt="" />
                                        <img class="slide-shape img-six" src="./assets/img/shape/zigzg-1.svg" alt="" />
                                        <img class="slide-shape img-seven wow fadeInRight animated" data-delay="1.5s" src="assets/img/shape/zigzg-1.svg" alt="" />
                                        <img class="slide-shape img-eight" src="./assets/img/slider/earth-bg.svg" alt="" />
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-6">
                                    <div class="slider__content pt-15">
                                        <h1 class="main-title mb-40 wow fadeInUp2 animated" data-wow-delay='.1s'> Learn Lead Excel  <br /> with <span class="vec-shape">  <img src="assets/img/logo/instvec.svg" alt="" /></span></h1>
                                        {/* <!-- &nbsp;&nbsp;&nbsp; Instruct (TEXT REMOVED) --> */}
                                        <h5 class="mb-35 wow fadeInUp2 animated" data-wow-delay='.2s'>Our courses emphasize critical thinking and real-world application, preparing students to analyze, question, and engage effectively with the world.</h5>
                                        {/* <!-- <ul class="search__area d-md-inline-flex align-items-center justify-content-between mb-30">
                                    <li>
                                        <div class="widget__search">
                                            <form class="input-form" action="#">
                                                <input type="text" placeholder="Find Courses">
                                            </form>
                                            <button class="search-icon"><i class="far fa-search"></i></button>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="widget__select">
                                            <select name="select-cat" id="select">
                                                <option value="">Categories</option>
                                                <option value="">Class One</option>
                                                <option value="">Class Two</option>
                                                <option value="">Class Three</option>
                                                <option value="">Class Four</option>
                                                <option value="">Class Five</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li>
                                        <button class="theme_btn search_btn ml-35">Search Now</button>
                                    </li>
                                </ul> --> */}
                                        <p class="highlight-text"><span>Be #1</span> Begin your educational journey today. </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="great-deal-area pt-150 pb-90 pt-md-100 pb-md-40 pt-xs-100 pb-xs-40">
                    <div class="container">
                        <div class="row justify-content-lg-center justify-content-start">
                            <div class="col-xl-3 col-lg-8">
                                <div class="deal-box mb-30 text-center text-xl-start">
                                    <h2 class="mb-20"><b>Features</b> You'll Love The Most </h2>
                                    <p class="sub-sub-title">Discover what sets our courses apart— creative-designed content, interactive tools, and much more of our courses
                                    </p>
                                </div>
                            </div>
                            <div class="col-xl-8">
                                <div class="deal-active owl-carousel mb-30">
                                    <div class="single-item">
                                        <div class="single-box mb-30">
                                            <div class="single-box__icon mb-25">
                                                <img src="assets/img/icon/creative.svg" alt="" />
                                            </div>
                                            <h4 class="sub-title mb-20"> Creative Content </h4>
                                            <p class="sub-sub-title"> We blend visuals and real-world examples for engagement.</p>
                                        </div>
                                    </div>
                                    <div class="single-item">
                                        <div class="single-box s-box2 mb-30">
                                            <div class="single-box__icon mb-25">
                                                <img src="assets/img/icon/community.svg" alt="" />
                                            </div>
                                            <h4 class="sub-title mb-20">Community Access</h4>
                                            <p class="sub-sub-title"> Connect with community and discuss with peers and experts. </p>
                                        </div>
                                    </div>
                                    <div class="single-item">
                                        <div class="single-box s-box3 mb-30">
                                            <div class="single-box__icon mb-25">
                                                <img src="assets/img/icon/problem solving.svg" alt="" />
                                            </div>
                                            <h4 class="sub-title mb-20">Practical Exercises</h4>
                                            <p class="sub-sub-title"> Practical tasks : The more you use it, the better you'll recall it.</p>
                                        </div>
                                    </div>
                                    <div class="single-item">
                                        <div class="single-box mb-30">
                                            <div class="single-box__icon mb-25">
                                                <img src="assets/img/icon/studymaterial1.svg" alt="" />
                                            </div>
                                            <h4 class="sub-title mb-20"> Course Materials </h4>
                                            <p class="sub-sub-title"> All-inclusive materials and simulations provided  </p>
                                        </div>
                                    </div>
                                    <div class="single-item">
                                        <div class="single-box s-box2 mb-30">
                                            <div class="single-box__icon mb-25">
                                                <img src="assets/img/icon/Instruct.svg" alt="" />
                                            </div>
                                            <h4 class="sub-title mb-20"> Quality Instructors </h4>
                                            <p class="sub-sub-title" >Instructors that Empowers Minds and Inspire Excellence </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="what-looking-for pos-rel"  >
                    <div class="what-blur-shape-one"></div>
                    <div class="what-blur-shape-two"></div>
                    <div class="what-look-bg gradient-bg pt-145 pb-130 pt-md-95 pb-md-80 pt-xs-95 pb-xs-80">
                        <div id="courses" class="container">
                            <div class="row justify-content-center">
                                <div class="col-lg-8">
                                    <div class="section-title text-center mb-55">
                                        <h5 class="bottom-line mb-25"> Our Courses </h5>
                                        <h2>What you Looking For?</h2>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-85">
                                <div class="col-xl-6 col-lg-6 col-md-6">
                                    <div class="what-box text-center mb-35 wow fadeInUp2 animated" data-wow-delay='.3s'>
                                        <div class="what-box__icon mb-30">
                                            <img src="assets/img/slider/1.svg" alt="" />
                                        </div>
                                        <h3>Vision</h3>
                                        <p> "The only thing worse than being blind <br />
                                            is having sight but no vision."<br />
                                            ~ Helen Keller</p>
                                        <a href="course-details.html" class="theme_btn border_btn"> Explore Now </a>
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-6 col-md-6">
                                    <div class="what-box text-center mb-35 wow fadeInUp2 animated" data-wow-delay='.3s'>
                                        <div class="what-box__icon mb-30">

                                        </div>
                                        <img src="assets/img/slider/more courses.svg" alt="" />
                                        <h3> More Courses Offered by us </h3>
                                        {/* <!-- <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed di nonumy eirmod tempor invidunt ut labore et dolore magn aliq erat.</p> --> */}
                                        <a href="coming soon.html" class="theme_btn border_btn">Explore Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div class="why-chose-section-wrapper gradient-bg mr-100 ml-100">

                    <section class="why-chose-us">
                        <div class="why-chose-us-bg pt-150 pb-175 pt-md-95 pb-md-90 pt-xs-95 pb-xs-90">
                            <div class="container">
                                <div class="row align-items-center">
                                    <div class="col-xl-7 col-lg-7">
                                        <div class="chose-img-wrapper mb-50 pos-rel">
                                            {/* <!-- <div class="coures-member">
                                        <h5>Total Students</h5>
                                        <img class="choses chose_01" src="assets/img/chose/01.png" alt="Chose-img">
                                        <img class="choses chose_02" src="assets/img/chose/02.png" alt="Chose-img">
                                        <img class="choses chose_03" src="assets/img/chose/03.png" alt="Chose-img">
                                        <img class="choses chose_04" src="assets/img/chose/04.png" alt="Chose-img">
                                        <span>25k+</span>
                                    </div> --> */}
                                            <div class="feature tag_01"><span><img src="assets/img/icon/shield-check.svg" alt="" /></span> Quality education </div>
                                            <div class="feature tag_02"><span><img src="assets/img/icon/catalog.svg" alt="" /></span> Quality Material  </div>

                                            <div class="video-wrapper">
                                                <a href="https://www.youtube.com/watch?v=7omGYwdcS04" class="popup-video"><i class="fas fa-play"></i></a>
                                            </div>
                                            <div class="img-bg pos-rel">
                                                <img class="chose_05 pl-70 pl-lg-0 pl-md-0 pl-xs-0" src="assets/img/chose/why-2.svg" alt="Chose-img" />
                                            </div>
                                            <img class="chose chose_06" src="../assets/img/shape/dot-box3.svg" alt="Chose-img" />
                                        </div>
                                    </div>
                                    <div class="col-xl-5 col-lg-5">
                                        <div class="chose-wrapper pl-25 pl-lg-0 pl-md-0 pl-xs-0">
                                            <div class="section-title mb-30 wow fadeInUp2 animated" data-wow-delay='.1s'>
                                                <h5 class="bottom-line mb-25"> Explore Instruct </h5>
                                                <h2 class="mb-25">Why Choose Us?</h2>
                                                <p>Our main goal is to provide practical, transformative education that equips students with real-world skills. While passing exams is important, mastering concepts for lifelong learning is our priority.</p>
                                            </div>
                                            <ul class="text-list mb-40 wow fadeInUp2 animated" data-wow-delay='.2s'>
                                                <li> Self-Paced Learning - Progress at a comfortable speed without deadlines. </li>
                                                <li>Supplemental Resources - Access additional readings, tools, and materials.</li>
                                                <li>Progressive Skill Building - Develop skills step-by-step from basic to advanced levels</li>
                                            </ul>
                                            <a href="about.html" class="theme_btn wow fadeInUp2 animated" data-wow-delay='.3s'>More Details</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                <section class="testimonial-area testimonial-pad pt-150 pb-120 pt-md-95 pb-md-70 pt-xs-95 pb-xs-70">
                    <div class="container custom-container-testimonial">
                        <div class="row align-items-center">
                            <div class="col-lg-8">
                                <div class="section-title text-center text-md-start mb-35">
                                    <h2 class="mb-25"> Our driving forces  </h2>
                                </div>
                            </div>
                            {/* <!-- <div class="col-lg-4 text-center text-lg-end">
                        <a href="instructor.html" class="theme_btn">Read All</a>
                    </div> --> */}
                        </div>
                        <div class="row testimonial-active-01">
                            <div class="col-xl-3">
                                <div class="item">
                                    <div class="testimonial-wrapper mb-30">
                                        <div class="testimonial-authors overflow-hidden mb-15">
                                            <div class="testimonial-authors__avatar">
                                                <img src="assets/img/testimonial/ambedkar.svg" alt="testi-author" />
                                            </div>
                                            <div class="testimonial-authors__content mt-10">
                                                <h4 class="sub-title">Dr. B.R. Ambedkar</h4>
                                            </div>
                                        </div>
                                        <p> "Cultivation of mind should be the ultimate aim of human existence." </p>
                                        <div class="quote-icon mt-20">
                                            <img src="assets/img/icon/quote.svg" alt="quote-icon" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3">
                                <div class="item">
                                    <div class="testimonial-wrapper mb-30">
                                        <div class="testimonial-authors overflow-hidden mb-15">
                                            <div class="testimonial-authors__avatar">
                                                <img src="assets/img/testimonial/nheru.svg" alt="testi-author" />
                                            </div>
                                            <div class="testimonial-authors__content mt-10">
                                                <h4 class="sub-title">Shri Jawaharlal Nehru</h4>
                                            </div>
                                        </div>
                                        <p>"The most important thing that education can give us is the ability to think and reason for ourselves."</p>
                                        <div class="quote-icon mt-20">
                                            <img src="assets/img/icon/quote.svg" alt="quote-icon" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3">
                                <div class="item">
                                    <div class="testimonial-wrapper mb-30">
                                        <div class="testimonial-authors overflow-hidden mb-15">
                                            <div class="testimonial-authors__avatar">
                                                <img src="assets/img/testimonial/socrates.svg" alt="testi-author" />
                                            </div>
                                            <div class="testimonial-authors__content mt-10">
                                                <h4 class="sub-title">Socrates</h4>

                                            </div>
                                        </div>
                                        <p>"I cannot teach anybody anything, I can only make them think."</p>
                                        <div class="quote-icon mt-20">
                                            <img src="assets/img/icon/quote.svg" alt="quote-icon" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3">
                                <div class="item">
                                    <div class="testimonial-wrapper mb-30">
                                        <div class="testimonial-authors overflow-hidden mb-15">
                                            <div class="testimonial-authors__avatar">
                                                <img src="assets/img/testimonial/kalam.svg" alt="testi-author" />
                                            </div>
                                            <div class="testimonial-authors__content mt-10">
                                                <h4 class="sub-title"> Dr. APJ Abdul Kalam</h4>

                                            </div>
                                        </div>
                                        <p>"Dream is not that which you see while sleeping, it is something that does not let you sleep."</p>
                                        <div class="quote-icon mt-20">
                                            <img src="assets/img/icon/quote.svg" alt="quote-icon" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3">
                                <div class="item">
                                    <div class="testimonial-wrapper mb-30">
                                        <div class="testimonial-authors overflow-hidden mb-15">
                                            <div class="testimonial-authors__avatar">
                                                <img src="assets/img/testimonial/albert.svg" alt="testi-author" />
                                            </div>
                                            <div class="testimonial-authors__content mt-10">
                                                <h4 class="sub-title">Albert Einstein</h4>
                                            </div>
                                        </div>
                                        <p>"Education is not the learning of facts, but the training of the mind to think."</p>
                                        <div class="quote-icon mt-20">
                                            <img src="assets/img/icon/quote.svg" alt="quote-icon" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}

export default HomePage