import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SkipNavContent,
} from "@chakra-ui/react";
import DishResultList from "../Components/DishResultList";
import { useNavigate, useParams } from "react-router-dom";

export default () => {
  const params = useParams();
  const navigate = useNavigate();

  const tab = params.tab ? parseInt(params.tab) : 0;
  const page = params.page ? parseInt(params.page) : 1;
  const perPage = params.perPage ? parseInt(params.perPage) : 20;

  return (
    <Tabs
      isManual
      isLazy
      index={tab}
      onChange={(index) => navigate("/dishes/" + index)}
    >
      <TabList>
        <Tab>My Dishes</Tab>
        <Tab>Shared Dishes</Tab>
        <Tab>All Dishes</Tab>
      </TabList>
      <TabPanels>
        <TabPanel padding="25px">
          <SkipNavContent />
          <DishResultList tab={tab} page={page} perPage={perPage} />
        </TabPanel>
        <TabPanel>
          <SkipNavContent />
          Mates
        </TabPanel>
        <TabPanel>
          <SkipNavContent />
          Everyone
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
