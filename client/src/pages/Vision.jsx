const Vision = () => {
    return (
      <div className="container mx-auto p-8">
        <div className="batch-heading flex">
          <h1>VISION</h1>
          <img src="assets/img/slider/1.svg" alt="vision banner" />
        </div>
  
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Physics Card */}
            <div className="card physics">
              <div className="card-content">
                <div>
                  <div className="card-icon">⚛️</div>
                  <h3 className="card-title">Physics</h3>
                  <p className="card-description">
                    The fundamental science of matter, energy, and the universe.
                  </p>
                  <p className="sub-description">
                    Deep blues stimulate deep thinking and abstract concept processing
                  </p>
                </div>
              </div>
            </div>
  
            {/* Chemistry Card */}
            <div className="card chemistry">
              <div className="card-content">
                <div>
                  <div className="card-icon">🧪</div>
                  <h3 className="card-title">Physical Chemistry</h3>
                  <p className="card-description">
                    The study of matter, its properties, and transformations.
                  </p>
                  <p className="sub-description">
                    Green represents growth and scientific discovery
                  </p>
                </div>
              </div>
            </div>
  
            {/* Organic Chemistry Card */}
            <div className="card organic-chem">
              <div className="card-content">
                <div>
                  <div className="card-icon">🧬</div>
                  <h3 className="card-title">Organic Chemistry</h3>
                  <p className="card-description">
                    The chemistry of carbon-based compounds and life processes.
                  </p>
                  <p className="sub-description">
                    Greens reflect natural carbon-based molecules and reduce eye strain
                  </p>
                </div>
              </div>
            </div>
  
            {/* Inorganic Chemistry Card */}
            <div className="card inorganic-chem">
              <div className="card-content">
                <div>
                  <div className="card-icon">💎</div>
                  <h3 className="card-title">Inorganic Chemistry</h3>
                  <p className="card-description">
                    Study of compounds not primarily based on carbon.
                  </p>
                  <p className="sub-description">
                    Crystal structures and mineral formations in focus
                  </p>
                </div>
              </div>
            </div>

                      {/* Botany Card */}
          <div className="card botany">
            <div className="card-content">
              <div>
                <div className="card-icon">🌿</div>
                <h3 className="card-title">Botany</h3>
                <p className="card-description">
                  The scientific study of plants, their structure, properties, and evolution.
                </p>
                <p className="sub-description">
                  Natural greens enhance connection with plant biology concepts
                </p>
              </div>
            </div>
          </div>
          {/* Zoology Card */}
          <div className="card zoology">
            <div className="card-content">
              <div>
                <div className="card-icon">🦒</div>
                <h3 className="card-title">Zoology</h3>
                <p className="card-description">
                  The study of animals and their behavior, structure, and evolution.
                </p>
                <p className="sub-description">
                  Warm earth tones increase engagement with biological concepts
                </p>
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>
    );
  };
  
  export default Vision;