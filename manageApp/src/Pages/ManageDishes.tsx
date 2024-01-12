import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SkipNavContent,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import DishResultList from "../Components/DishResultList";
import { useNavigate, useParams } from "react-router-dom";

const ManageDishes = () => {
  const params = useParams();
  const navigate = useNavigate();

  const tab = params.tab ? parseInt(params.tab) : 0;
  const page = params.page ? parseInt(params.page) : 1;
  const perPage = params.perPage ? parseInt(params.perPage) : 20;

  return (
    <>
      <Breadcrumb padding="0.375rem">
        <BreadcrumbItem isCurrentPage color="copper.600" fontWeight="bold">
          <BreadcrumbLink>Browse Dishes</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Tabs
        isManual
        isLazy
        index={tab}
        onChange={(index) => navigate("/dishes/" + index)}
        colorScheme="copper"
      >
        <TabList>
          <Tab>My Dishes</Tab>
          <Tab>Shared Dishes</Tab>
          <Tab>All Dishes</Tab>
        </TabList>
        <TabPanels>
          <TabPanel padding="25px">
            <SkipNavContent />
            <DishResultList
              tab={tab}
              page={page}
              perPage={perPage}
              filter="owned"
            />
          </TabPanel>
          <TabPanel padding="25px">
            <SkipNavContent />
            <DishResultList
              tab={tab}
              page={page}
              perPage={perPage}
              filter="shared"
            />
          </TabPanel>
          <TabPanel padding="25px">
            <SkipNavContent />
            <DishResultList
              tab={tab}
              page={page}
              perPage={perPage}
              filter="all"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default ManageDishes;
