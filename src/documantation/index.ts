import basicInfo from "./basicInfo";
import { replies } from "./reply";
import { categories } from "./category";
import { compliants } from "./compliant";
import { roles } from "./role";
import { users } from "./user";

export default {
  ...basicInfo,
  paths: {
    ...users,
    ...roles,
    ...categories,
    ...compliants,
    ...replies,
  },
};
