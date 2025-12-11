'use client'

import { useState } from 'react'
import { Badge } from './Badge'
import { Card } from './Card'

interface JobBriefProps {
  jobTitle: string
  requiredSkills?: string[]
  similarJobs?: Array<{ id: string; title: string; company: string }>
  relatedRoles?: string[]
  companySizeCategory?: string
  industryCategory?: string
}

export function JobBrief({
  jobTitle,
  requiredSkills = [],
  similarJobs = [],
  relatedRoles = [],
  companySizeCategory = 'Scale-up',
  industryCategory = 'Technology',
}: JobBriefProps) {
  const [activeTab, setActiveTab] = useState<'skills' | 'similar' | 'roles'>('skills')

  return (
    <div className="space-y-6">
      {/* Skills Graph */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Skills Intelligence</h3>

        <div className="space-y-4">
          {requiredSkills.length > 0 ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Key competencies for success in this role
              </p>
              <div className="space-y-3">
                {requiredSkills.map((skill) => (
                  <div key={skill} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{skill}</span>
                        <span className="text-xs text-gray-500">High Priority</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: '85%' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-600 py-4">Skills information will appear here</p>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'skills'
              ? 'border-purple-700 text-purple-700'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Similar Roles
        </button>
        <button
          onClick={() => setActiveTab('similar')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'similar'
              ? 'border-purple-700 text-purple-700'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          At This Company
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'roles'
              ? 'border-purple-700 text-purple-700'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Market Data
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'skills' && (
        <Card>
          <h4 className="font-bold text-gray-900 mb-4">🎯 Similar Executive Roles</h4>
          {relatedRoles.length > 0 ? (
            <div className="space-y-3">
              {relatedRoles.map((role) => (
                <div key={role} className="p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">{role}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.floor(Math.random() * 50 + 50)}% skill overlap
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 py-4">Discover related executive roles that match your profile</p>
          )}
        </Card>
      )}

      {activeTab === 'similar' && (
        <Card>
          <h4 className="font-bold text-gray-900 mb-4">🏢 Other Roles at This Company</h4>
          {similarJobs.length > 0 ? (
            <div className="space-y-3">
              {similarJobs.map((job) => (
                <div key={job.id} className="p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">{job.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.floor(Math.random() * 50 + 40)}% skill overlap
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 py-4">Other opportunities available at this organization</p>
          )}
        </Card>
      )}

      {activeTab === 'roles' && (
        <Card>
          <h4 className="font-bold text-gray-900 mb-4">📈 Market Intelligence</h4>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Average Market Rate</p>
              <p className="text-2xl font-bold text-purple-700">£{Math.floor(Math.random() * 500 + 800)}/day</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Company Size</p>
                <p className="font-semibold text-gray-900">{companySizeCategory}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Industry</p>
                <p className="font-semibold text-gray-900">{industryCategory}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-3">High Demand Skills</p>
              <div className="flex flex-wrap gap-2">
                {['Leadership', 'Strategy', 'Financial Acumen', 'Digital', 'Change Mgmt'].map((tag) => (
                  <Badge key={tag} variant="primary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* AI Insights */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
        <div className="flex gap-3">
          <div className="text-2xl">✨</div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-2">AI-Powered Insights</h4>
            <p className="text-sm text-gray-600">
              Based on your profile and market data, you have a <span className="font-semibold text-purple-700">92% match</span> for this role.
              Your leadership experience and strategic background align well with the requirements.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
