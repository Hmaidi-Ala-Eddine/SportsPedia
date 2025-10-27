import TeamData from '@/assets/jsonData/team/TeamData.json'
import SingleTeamMemberInfo from '@/components/team/SingleTeamMemberInfo';
import LayoutV5 from '@/components/layouts/LayoutV5';
import { useParams } from 'react-router-dom';

const TeamDetailsPage = () => {

    const { id } = useParams()
    const data = TeamData.find(team => team.id === parseInt(id))

    return (
        <>
            <LayoutV5>
                <SingleTeamMemberInfo teamInfo={data} />
            </LayoutV5>
        </>
    );
};

export default TeamDetailsPage;