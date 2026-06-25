import * as actions from "./actions";

export const auth: any = null;
export const secondaryAuth: any = null;

const db = {
  adminUser: {
    findUnique: async ({ where }: any) => {
      const users = await actions.getAdminUsers();
      if (where.email) {
        return users.find((u: any) => u.email === where.email) || null;
      }
      if (where.id) {
        return users.find((u: any) => Number(u.id) === Number(where.id)) || null;
      }
      return null;
    },
    findFirst: async () => {
      const users = await actions.getAdminUsers();
      return users[0] || null;
    },
    create: async ({ data }: any) => {
      return actions.createAdminUser(data);
    },
    findMany: async () => {
      return actions.getAdminUsers();
    },
    update: async ({ where, data }: any) => {
      return actions.updateAdminUser(Number(where.id), data);
    },
    delete: async ({ where }: any) => {
      return actions.deleteAdminUser(Number(where.id));
    }
  },
  category: {
    count: async () => {
      return actions.getCategoryCount();
    },
    findMany: async (options: any = {}) => {
      return actions.getCategories(options);
    },
    findUnique: async ({ where }: any) => {
      return actions.findCategoryUnique(where);
    },
    create: async ({ data }: any) => {
      return actions.createCategory(data);
    },
    update: async ({ where, data }: any) => {
      return actions.updateCategory(Number(where.id), data);
    },
    delete: async ({ where }: any) => {
      return actions.deleteCategory(Number(where.id));
    }
  },
  video: {
    count: async () => {
      return actions.getVideoCount();
    },
    findFirst: async (options: any = {}) => {
      return actions.findFirstVideo(options);
    },
    findMany: async (options: any = {}) => {
      return actions.getVideos(options);
    },
    create: async (options: any) => {
      return actions.createVideo(options.data);
    },
    update: async (options: any) => {
      return actions.updateVideo(Number(options.where.id), options.data);
    },
    delete: async ({ where }: any) => {
      return actions.deleteVideo(Number(where.id));
    }
  },
  contactSetting: {
    findFirst: async () => {
      return actions.getContactSetting();
    },
    create: async ({ data }: any) => {
      return actions.createContactSetting(data);
    },
    update: async ({ where, data }: any) => {
      return actions.updateContactSetting(Number(where.id), data);
    },
    upsert: async ({ update }: any) => {
      return actions.upsertContactSetting(update);
    }
  },
  generalSetting: {
    findUnique: async ({ where }: any) => {
      return actions.getGeneralSetting(where.id);
    },
    upsert: async ({ where, update }: any) => {
      return actions.upsertGeneralSetting(where.id, update);
    }
  }
};

export default db;
