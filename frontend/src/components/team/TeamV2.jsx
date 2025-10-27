import TeamData from "@/assets/jsonData/team/TeamData.json";
import SingleTeamV2 from './SingleTeamV2';

const TeamV2 = ({ sectionClass }) => {
    return (
        <>
            <div className={`team-style-two-area default-padding ${sectionClass ? sectionClass : ""}`}>
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
                        {TeamData.slice(0, 5).map(team =>
                            <div className="col-lg-4 col-md-6 team-style-two" key={team.id}>
                                <SingleTeamV2 team={team} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamV2;