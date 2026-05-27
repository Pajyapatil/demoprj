/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

const STORAGE_KEY = "businessAutomationPlatformState";

const createId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const seedState = () => {
  const organisations = [
    {
      id: "org-1",
      name: "Sunrise Clinic",
      code: "SUN001",
      address: "12 MG Road, Pune",
      contactNo: "9876543210",
    },
    {
      id: "org-2",
      name: "Metro Realty",
      code: "MET002",
      address: "44 Linking Road, Mumbai",
      contactNo: "9123456780",
    },
  ];

  const users = [
    {
      id: "user-admin",
      name: "Platform Admin",
      email: "admin@biznotify.com",
      address: "Head Office, Pune",
      contact: "9000000001",
      password: "admin123",
      role: "admin",
      organisationId: "org-1",
    },
    {
      id: "user-1",
      name: "Riya Sharma",
      email: "user@biznotify.com",
      address: "Baner, Pune",
      contact: "9000000002",
      password: "user123",
      role: "user",
      organisationId: "org-1",
    },
    {
      id: "user-2",
      name: "Arjun Mehta",
      email: "arjun@metro.com",
      address: "Andheri, Mumbai",
      contact: "9000000003",
      password: "user123",
      role: "user",
      organisationId: "org-2",
    },
  ];

  return {
    sessionUserId: null,
    organisations,
    users,
    contacts: [
      {
        id: "contact-1",
        userId: "user-1",
        name: "Priya Kulkarni",
        email: "priya@example.com",
        phone: "9811111111",
      },
      {
        id: "contact-2",
        userId: "user-2",
        name: "Rohan Desai",
        email: "rohan@example.com",
        phone: "9822222222",
      },
    ],
    campaigns: [
      {
        id: "campaign-1",
        userId: "user-1",
        name: "Appointment Reminder",
        message: "Reminder for tomorrow's appointment.",
        channel: "WhatsApp",
      },
      {
        id: "campaign-2",
        userId: "user-2",
        name: "Weekend Property Update",
        message: "New listings are available for site visits.",
        channel: "Email",
      },
    ],
    schedules: [
      {
        id: "schedule-1",
        userId: "user-1",
        title: "Reminder Burst",
        message: "Send reminders to tomorrow's patients.",
        date: "2026-04-07",
        time: "10:00",
        channel: "WhatsApp",
      },
      {
        id: "schedule-2",
        userId: "user-2",
        title: "Open House Invite",
        message: "Invite warm leads for Saturday visit.",
        date: "2026-04-08",
        time: "16:30",
        channel: "SMS",
      },
    ],
    settings: {
      platformName: "BizNotify",
      supportEmail: "support@biznotify.com",
      timezone: "Asia/Kolkata",
      defaultChannel: "WhatsApp",
      quietHours: "22:00 - 07:00",
      retryLimit: "3",
    },
  };
};

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return seedState();
    }

    const parsed = JSON.parse(saved);
    const fallback = seedState();

    return {
      ...fallback,
      ...parsed,
      organisations: parsed.organisations || fallback.organisations,
      users: parsed.users || fallback.users,
      contacts: parsed.contacts || fallback.contacts,
      campaigns: parsed.campaigns || fallback.campaigns,
      schedules: parsed.schedules || fallback.schedules,
      settings: {
        ...fallback.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch (error) {
    console.error("Failed to load app state", error);
    return seedState();
  }
};

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const currentUser =
    state.users.find((user) => user.id === state.sessionUserId) || null;

  const login = (email, password) => {
    const user = state.users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    setState((previous) => ({
      ...previous,
      sessionUserId: user.id,
    }));

    return {
      success: true,
      user,
    };
  };

  const logout = () => {
    setState((previous) => ({
      ...previous,
      sessionUserId: null,
    }));
  };

  const register = (payload) => {
    const alreadyExists = state.users.some(
      (user) => user.email.toLowerCase() === payload.email.trim().toLowerCase()
    );

    if (alreadyExists) {
      return {
        success: false,
        message: "A user with this email already exists.",
      };
    }

    const newUser = {
      id: createId("user"),
      name: payload.name.trim(),
      email: payload.email.trim(),
      address: payload.address.trim(),
      contact: payload.contact.trim(),
      password: payload.password,
      role: payload.role,
      organisationId: payload.organisationId || "",
    };

    setState((previous) => ({
      ...previous,
      users: [...previous.users, newUser],
      sessionUserId: newUser.id,
    }));

    return {
      success: true,
      user: newUser,
    };
  };

  const saveOrganisation = (payload, organisationId = null) => {
    const trimmedCode = payload.code.trim().toUpperCase();

    const duplicate = state.organisations.some(
      (organisation) =>
        organisation.code.toUpperCase() === trimmedCode &&
        organisation.id !== organisationId
    );

    if (duplicate) {
      return {
        success: false,
        message: "Organisation code must be unique.",
      };
    }

    const organisation = {
      id: organisationId || createId("org"),
      name: payload.name.trim(),
      code: trimmedCode,
      address: payload.address.trim(),
      contactNo: payload.contactNo.trim(),
    };

    setState((previous) => ({
      ...previous,
      organisations: organisationId
        ? previous.organisations.map((item) =>
            item.id === organisationId ? organisation : item
          )
        : [...previous.organisations, organisation],
    }));

    return { success: true };
  };

  const deleteOrganisation = (organisationId) => {
    setState((previous) => ({
      ...previous,
      organisations: previous.organisations.filter(
        (organisation) => organisation.id !== organisationId
      ),
      users: previous.users.map((user) =>
        user.organisationId === organisationId
          ? { ...user, organisationId: "" }
          : user
      ),
    }));
  };

  const saveUser = (payload, userId = null) => {
    const duplicate = state.users.some(
      (user) =>
        user.email.toLowerCase() === payload.email.trim().toLowerCase() &&
        user.id !== userId
    );

    if (duplicate) {
      return {
        success: false,
        message: "Email address must be unique.",
      };
    }

    const updatedUser = {
      id: userId || createId("user"),
      name: payload.name.trim(),
      email: payload.email.trim(),
      address: payload.address.trim(),
      contact: payload.contact.trim(),
      password: payload.password,
      role: payload.role,
      organisationId: payload.organisationId || "",
    };

    setState((previous) => ({
      ...previous,
      users: userId
        ? previous.users.map((user) => (user.id === userId ? updatedUser : user))
        : [...previous.users, updatedUser],
    }));

    return { success: true };
  };

  const deleteUser = (userId) => {
    const userToDelete = state.users.find((user) => user.id === userId);
    const adminCount = state.users.filter((user) => user.role === "admin").length;

    if (
      userToDelete?.role === "admin" &&
      adminCount === 1
    ) {
      return {
        success: false,
        message: "At least one admin account must remain.",
      };
    }

    setState((previous) => ({
      ...previous,
      users: previous.users.filter((user) => user.id !== userId),
      contacts: previous.contacts.filter((contact) => contact.userId !== userId),
      campaigns: previous.campaigns.filter((campaign) => campaign.userId !== userId),
      schedules: previous.schedules.filter((schedule) => schedule.userId !== userId),
      sessionUserId:
        previous.sessionUserId === userId ? null : previous.sessionUserId,
    }));

    return { success: true };
  };

  const saveContact = (payload, contactId = null) => {
    const contact = {
      id: contactId || createId("contact"),
      userId: payload.userId,
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
    };

    setState((previous) => ({
      ...previous,
      contacts: contactId
        ? previous.contacts.map((item) => (item.id === contactId ? contact : item))
        : [...previous.contacts, contact],
    }));
  };

  const deleteContact = (contactId) => {
    setState((previous) => ({
      ...previous,
      contacts: previous.contacts.filter((contact) => contact.id !== contactId),
    }));
  };

  const saveCampaign = (payload, campaignId = null) => {
    const campaign = {
      id: campaignId || createId("campaign"),
      userId: payload.userId,
      name: payload.name.trim(),
      message: payload.message.trim(),
      channel: payload.channel,
    };

    setState((previous) => ({
      ...previous,
      campaigns: campaignId
        ? previous.campaigns.map((item) =>
            item.id === campaignId ? campaign : item
          )
        : [...previous.campaigns, campaign],
    }));
  };

  const deleteCampaign = (campaignId) => {
    setState((previous) => ({
      ...previous,
      campaigns: previous.campaigns.filter(
        (campaign) => campaign.id !== campaignId
      ),
    }));
  };

  const saveSchedule = (payload, scheduleId = null) => {
    const schedule = {
      id: scheduleId || createId("schedule"),
      userId: payload.userId,
      title: payload.title.trim(),
      message: payload.message.trim(),
      date: payload.date,
      time: payload.time,
      channel: payload.channel,
    };

    setState((previous) => ({
      ...previous,
      schedules: scheduleId
        ? previous.schedules.map((item) =>
            item.id === scheduleId ? schedule : item
          )
        : [...previous.schedules, schedule],
    }));
  };

  const deleteSchedule = (scheduleId) => {
    setState((previous) => ({
      ...previous,
      schedules: previous.schedules.filter(
        (schedule) => schedule.id !== scheduleId
      ),
    }));
  };

  const updateSettings = (payload) => {
    setState((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        ...payload,
      },
    }));
  };

  const value = {
    state,
    currentUser,
    organisations: state.organisations,
    users: state.users,
    contacts: state.contacts,
    campaigns: state.campaigns,
    schedules: state.schedules,
    settings: state.settings,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
    register,
    saveOrganisation,
    deleteOrganisation,
    saveUser,
    deleteUser,
    saveContact,
    deleteContact,
    saveCampaign,
    deleteCampaign,
    saveSchedule,
    deleteSchedule,
    updateSettings,
    isDarkMode,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider.");
  }

  return context;
}
