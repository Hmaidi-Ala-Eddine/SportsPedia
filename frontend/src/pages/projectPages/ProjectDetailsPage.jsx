import LayoutV5 from '@/components/layouts/LayoutV5';
import ProjectDetailsContent from '@/components/projects/ProjectDetailsContent';
import { useParams } from 'react-router-dom';
import GalleryV2Data from "@/assets/jsonData/gallery/GalleryV2Data.json"

const ProjectDetailsPage = () => {

    const { id } = useParams()
    const data = GalleryV2Data.find(project => project.id === parseInt(id))

    return (
        <>
            <LayoutV5>
                <ProjectDetailsContent projectInfo={data} />
            </LayoutV5>
        </>
    );
};

export default ProjectDetailsPage;