import basicInfo from "./basicInfo";
import { roles } from "./role";
import { users } from "./user";
import { categories } from "./category";
import { compliants } from "./compliant";
import { organizations } from "./organization";
import { compliantOrganization } from "./compliantOrganization";
import { replies } from "./reply";

export default {
  ...basicInfo,
  paths: {
    ...users,
    ...roles,
    ...categories,
    ...compliants,
    ...organizations,
    ...compliantOrganization,
    ...replies,
  },
};
