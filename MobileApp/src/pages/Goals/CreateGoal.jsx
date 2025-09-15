// src/pages/Goals/CreateGoal.jsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Layout from "../../components/navigation/Layout";

/* ------------------------------------------------------------------ */
/* Small UI helpers                                                    */
/* ------------------------------------------------------------------ */

const FieldLabel = ({ children, right }) => (
  <View style={styles.labelRow}>
    <Text style={styles.label}>{children}</Text>
    {right}
  </View>
);

const Input = ({ style, ...props }) => (
  <View style={styles.inputWrap}>
    <TextInput
      placeholderTextColor="#94A3B8"
      style={[styles.input, style]}
      {...props}
    />
  </View>
);

const Select = ({ value, placeholder, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable style={styles.select} onPress={() => setOpen(true)}>
        <Text style={[styles.selectText, !value && { color: "#94A3B8" }]}>
          {value || placeholder}
        </Text>
        <Icon name="chevron-down" size={18} color="#64748B" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View />
        </Pressable>
        <View style={styles.modalSheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{placeholder}</Text>
            <Pressable onPress={() => setOpen(false)}>
              <Icon name="x" size={22} color="#0F172A" />
            </Pressable>
          </View>

          {options.map((opt) => (
            <Pressable
              key={opt}
              style={styles.sheetItem}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              <Text style={styles.sheetItemText}>{opt}</Text>
              {value === opt && <Icon name="check" size={18} color="#10B981" />}
            </Pressable>
          ))}
        </View>
      </Modal>
    </>
  );
};

const DateField = ({ value, placeholder, onPick }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable style={styles.select} onPress={() => setOpen(true)}>
        <Text style={[styles.selectText, !value && { color: "#94A3B8" }]}>
          {value || placeholder}
        </Text>
        <Icon name="calendar" size={18} color="#64748B" />
      </Pressable>

      {/* Simple inline picker list (replace with @react-native-community/datetimepicker if you like) */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View />
        </Pressable>
        <View style={styles.modalSheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Pick a date</Text>
            <Pressable onPress={() => setOpen(false)}>
              <Icon name="x" size={22} color="#0F172A" />
            </Pressable>
          </View>

          {/* Demo quick dates */}
          {["2025/09/30", "2025/12/01", "2026/01/15"].map((d) => (
            <Pressable
              key={d}
              style={styles.sheetItem}
              onPress={() => {
                onPick(d);
                setOpen(false);
              }}
            >
              <Text style={styles.sheetItemText}>{d}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </>
  );
};

const ImageChoice = ({ item, selected, onPress }) => (
  <Pressable onPress={onPress} style={[styles.thumb, selected && styles.thumbSelected]}>
    {/* Replace this block with <Image source={item.src} /> when you add real images */}
    <View style={styles.thumbImage}>
      <Icon name="image" size={22} color="#64748B" />
    </View>
    <Text style={styles.thumbCaption} numberOfLines={1}>
      {item.label}
    </Text>
  </Pressable>
);

/* ------------------------------------------------------------------ */
/* Main Screen                                                         */
/* ------------------------------------------------------------------ */

const CreateGoal = ({ navigation }) => {
  // Form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goalType, setGoalType] = useState("");
  const [category, setCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const goalTypes = useMemo(() => ["Savings", "Spending Limit", "Donation"], []);
  const categories = useMemo(
    () => ["Apartment", "House", "Office", "Education", "Travel", "Car", "Emergency"],
    []
  );
  const gallery = useMemo(
    () => [
      { id: "apt", label: "Apartment" },
      { id: "house", label: "House" },
      { id: "office", label: "Office" },
      { id: "street", label: "Street" },
      { id: "park", label: "Park" },
      { id: "garden", label: "Garden" },
    ],
    []
  );

  const handleSubmit = () => {
    // TODO: connect to your API
    const payload = {
      name,
      amount,
      startDate,
      endDate,
      goalType,
      category,
      bannerKey: selectedImage,
    };
    console.log("Create Goal payload:", payload);
    navigation?.navigate("Goals"); // or wherever you want to go after saving
  };

  return (
    <Layout
      activeTab="CreateGoal"
      navigation={navigation}
      onBellPress={() => navigation.navigate("Notifications")}
      onAvatarPress={() => navigation.navigate("Profile")}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Create a Goal</Text>

        {/* Goal Name / Target Amount */}
        <FieldLabel>Goal Name</FieldLabel>
        <Input
          placeholder="e.g. Vacation Fund"
          value={name}
          onChangeText={setName}
          autoCapitalize="sentences"
        />

        <FieldLabel>Target Amount (R)</FieldLabel>
        <Input
          placeholder="e.g. 15000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Timeframe */}
        <Text style={styles.h2}>Timeframe</Text>

        <FieldLabel>Start Date</FieldLabel>
        <DateField value={startDate} placeholder="yyyy/mm/dd" onPick={setStartDate} />

        <FieldLabel>End Date</FieldLabel>
        <DateField value={endDate} placeholder="yyyy/mm/dd" onPick={setEndDate} />

        {/* Goal Type */}
        <FieldLabel>Goal Type</FieldLabel>
        <Select
          value={goalType}
          placeholder="Select goal type"
          options={goalTypes}
          onSelect={setGoalType}
        />

        {/* Category + XP hint */}
        <Text style={styles.h2}>Category</Text>

        <View style={styles.labelRow}>
          <Text style={styles.label}>Goal Category</Text>
          <Text style={styles.xpHint}>XP Reward: 20 XP</Text>
        </View>
        <Select
          value={category}
          placeholder="Select a category"
          options={categories}
          onSelect={setCategory}
        />

        {/* Visual Representation */}
        <Text style={styles.h2}>Visual Representation</Text>
        <Text style={styles.helperText}>Choose an image to represent your goal</Text>

        <FlatList
          data={gallery}
          numColumns={3}
          keyExtractor={(it) => it.id}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <ImageChoice
              item={item}
              selected={selectedImage === item.id}
              onPress={() => setSelectedImage(item.id)}
            />
          )}
          scrollEnabled={false}
        />

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.btnGhost} onPress={() => navigation.goBack()}>
            <Text style={styles.btnGhostText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.btnPrimary} onPress={handleSubmit}>
            <Text style={styles.btnPrimaryText}>Create Goal</Text>
            <Icon name="arrow-right" size={18} color="#fff" />
          </Pressable>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default CreateGoal;

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const GREEN = "#88BC46";
const GREEN_DARK = "#0A7F2E";
const SURFACE = "#FFFFFF";
const BORDER = "#E5E7EB";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },

  h2: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 18,
    marginBottom: 8,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  xpHint: {
    fontSize: 12,
    fontWeight: "800",
    color: "#10B981",
  },

  inputWrap: {
    backgroundColor: SURFACE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    height: 46,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  input: {
    fontSize: 14,
    color: "#111827",
    paddingVertical: 0,
  },

  select: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  selectText: {
    fontSize: 14,
    color: "#111827",
  },

  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },

  /* Image gallery */
  thumb: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 8,
  },
  thumbSelected: {
    borderColor: GREEN,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumbImage: {
    height: 78,
    borderRadius: 10,
    backgroundColor: "#E5EDF6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  thumbCaption: {
    fontSize: 12,
    color: "#0F172A",
  },

  /* Modal sheet */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  sheetItem: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  sheetItemText: {
    fontSize: 14,
    color: "#111827",
  },

  /* Actions */
  actionsRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  btnGhost: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  btnGhostText: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "700",
  },
  btnPrimary: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: GREEN_DARK,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});
