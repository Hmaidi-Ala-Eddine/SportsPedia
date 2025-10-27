import TeamData from '@/assets/jsonData/team/TeamData.json';
import SingleTeamV1 from './SingleTeamV1';

const TeamV3 = () => {
    return (
        <>
            <div className="team-style-three-area default-padding bottom-less">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">Team Members</h4>
                                <h2 className="title">Meet the talented team form our company</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        {TeamData.slice(0, 4).map(team =>
                            <div className="col-lg-3 col-md-6 mb-30" key={team.id} >
                                <SingleTeamV1 team={team} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamV3;