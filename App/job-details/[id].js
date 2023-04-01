import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import { Company, JobAbout, JobFooter, JobTabs, ScreenHeaderBtn, Specifics } from '../../components'
import React, { useCallback, useState } from 'react'
import { Stack, useRouter, useSearchParams } from 'expo-router'
import { COLORS, icons, SIZES } from '../../constants'
import useFetch from '../../hook/useFetch'

const tabs = ["About", "Qualifications", "Responsibilities"]

const JobDetails = () => {
    const [refreshing, setRefreshing] = useState(false)
    const [activeTab, setActiveTab] = useState(tabs[0])
    const params = useSearchParams()
    const router = useRouter()

    const { data, isLoading, error, refetch } = useFetch("job-details", { job_id: params.id })
    const job = data === null ? null : data[0]
    const { employer_logo, job_title, employer_name, job_country, job_highlights, job_description, job_google_link } = job || {};

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        refetch()
        setRefreshing(false)
    }, [])

    const displayTabContent = () => {
        switch (activeTab) {
            case "Qualifications":
                return <Specifics title="Qualifications" points={job_highlights?.Qualifications ?? ['N/A']} />
            case "About":
                return <JobAbout info={job_description ?? "No data provided"} />
            case "Responsibilities":
                return <Specifics title="Qualifications" points={job_highlights?.Responsibilities ?? ['N/A']} />

            default:
                break;
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.lightWhite },
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    headerLeft: () => (
                        <ScreenHeaderBtn
                            iconUrl={icons.left}
                            dimension="60%"
                            handlePress={() => router.back()}
                        />
                    ),
                    headerRight: () => (
                        <ScreenHeaderBtn
                            iconUrl={icons.share}
                            dimension="60%"
                        // handlePress={() => Share()}
                        />
                    ),
                    headerTitle: ""
                }}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {(isLoading || data === null) ?
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    : error ? (
                        <Text>Something went wrong</Text>
                    ) : data.length === 0 ? (
                        <Text>No data found</Text>
                    ) : (
                        <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
                            <Company
                                companyLogo={employer_logo}
                                jobTitle={job_title}
                                companyName={employer_name}
                                location={job_country}
                            />
                            <JobTabs
                                tabs={tabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />

                            {displayTabContent()}
                        </View>
                    )}
            </ScrollView>
            <JobFooter url={job_google_link ?? 'https://careers.google.com/jobs/results'} />
        </SafeAreaView>
    )

}

export default JobDetails;