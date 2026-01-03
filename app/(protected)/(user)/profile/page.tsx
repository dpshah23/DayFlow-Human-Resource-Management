"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { User, Mail, Phone, Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUser } from "@/hooks/useUser";
import {
  fetchUserProfileAction,
  updateUserProfileAction,
} from "@/actions/data/profile";
import { PageTitle } from "@/components/ui/reusable-components";
import { UpdateProfileSchema } from "@/schemas/profile";

export default function ProfilePage() {
  const { user: currentUser } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      salary: null,
    },
  });

  // -----------------------------
  // Fetch profile
  // -----------------------------
  useEffect(() => {
    if (currentUser?.id) {
      fetchProfile();
    }
  }, [currentUser?.id]);

  const fetchProfile = async () => {
    if (!currentUser?.id) return;

    setIsLoading(true);
    const response = await fetchUserProfileAction(currentUser.id);

    if (response.success && response.data) {
      const { name, profile } = response.data;

      form.reset({
        name: name ?? "",
        phone: profile?.phone ?? "",
        address: profile?.address ?? "",
        salary: profile?.salary ?? null,
      });
    } else {
      addToast({
        title: "Error",
        description: response.message || "Failed to load profile",
        color: "danger",
      });
    }

    setIsLoading(false);
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const onSubmit = (data: any) => {
    if (!currentUser?.id) return;

    startTransition(async () => {
      const response = await updateUserProfileAction(currentUser.id, data);

      if (response.success) {
        addToast({
          title: "Success",
          description: "Profile updated successfully",
          color: "success",
        });
        fetchProfile();
      } else {
        addToast({
          title: "Error",
          description: response.message || "Failed to update profile",
          color: "danger",
        });
      }
    });
  };

  if (!currentUser || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <section className="size-full">
      <PageTitle
        centered={false}
        subtitle="Manage your personal information"
        title="Profile Settings"
      />

      <Card className="bg-content2">
        <CardHeader className="px-6 pt-6 pb-0">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-foreground">
              Personal Information
            </h2>
            <p className="text-sm text-foreground/60">
              Update your account details
            </p>
          </div>
        </CardHeader>

        <CardBody className="p-6">
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Name */}
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  isRequired
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  label="Full Name"
                  placeholder="Enter your full name"
                  startContent={<User size={18} />}
                />
              )}
            />

            {/* Email (read-only) */}
            <Input
              isReadOnly
              label="Email"
              startContent={<Mail size={18} />}
              value={currentUser.email}
            />

            {/* Phone */}
            <Controller
              control={form.control}
              name="phone"
              render={({
                field: { name, value, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <Input
                  // {...field}
                  ref={ref}
                  errorMessage={error?.message}
                  isInvalid={invalid}
                  label="Phone Number"
                  name={name}
                  placeholder="Enter phone number"
                  startContent={<Phone size={18} />}
                  value={value ?? ""}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
            />

            {/* Address */}
            <Controller
              control={form.control}
              name="address"
              render={({ field: { name, value, onChange, onBlur, ref } }) => (
                <Input
                  ref={ref}
                  label="Address"
                  name={name}
                  placeholder="Your address"
                  value={value ?? ""}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
            />

            {/* Salary (read-only for employees) */}
            <Controller
              control={form.control}
              name="salary"
              render={({
                field: { name, value, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <Input
                  ref={ref}
                  isReadOnly
                  description="Contact HR to update salary"
                  errorMessage={error?.message}
                  isInvalid={invalid}
                  label="Salary"
                  name={name}
                  placeholder="Salary"
                  type="string"
                  value={
                    value !== null && value !== undefined
                      ? value.toString()
                      : ""
                  }
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                isDisabled={isPending}
                variant="flat"
                onPress={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                color="primary"
                isLoading={isPending}
                startContent={!isPending && <Save size={18} />}
                type="submit"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
