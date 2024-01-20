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
import { useNavigate, useParams } from "react-router-dom";
import RecipeResultList from "../Components/RecipeResultList";

const ManageRecipes = () => {
  const params = useParams();
  const navigate = useNavigate();

  const tab = params.tab ? parseInt(params.tab) : 0;
  const page = params.page ? parseInt(params.page) : 1;
  const perPage = params.perPage ? parseInt(params.perPage) : 20;

  return (
    <>
      <Breadcrumb padding="0.375rem">
        <BreadcrumbItem isCurrentPage color="copper.600" fontWeight="bold">
          <BreadcrumbLink>Browse Recipes</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Tabs
        isManual
        isLazy
        index={tab}
        onChange={(index) => navigate("/recipes/" + index)}
        colorScheme="copper"
      >
        <TabList>
          <Tab>My Recipes</Tab>
          <Tab>Shared Recipes</Tab>
          <Tab>All Recipes</Tab>
        </TabList>
        <TabPanels>
          <TabPanel padding="25px">
            <SkipNavContent />
            <RecipeResultList
              tab={tab}
              page={page}
              perPage={perPage}
              filter="owned"
            />
          </TabPanel>
          <TabPanel padding="25px">
            <SkipNavContent />
            <RecipeResultList
              tab={tab}
              page={page}
              perPage={perPage}
              filter="shared"
            />
          </TabPanel>
          <TabPanel padding="25px">
            <SkipNavContent />
            <RecipeResultList
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

export default ManageRecipes;
