import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import DishResultList from "../Components/DishResultList";

export default () => (
  <Tabs isManual isLazy>
    <TabList>
      <Tab>My Dishes</Tab>
      <Tab>Shared Dishes</Tab>
      <Tab>All Dishes</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <DishResultList />
      </TabPanel>
      <TabPanel>Mates</TabPanel>
      <TabPanel>Everyone</TabPanel>
    </TabPanels>
  </Tabs>
);
