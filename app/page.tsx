"use client" // Charts need client-side rendering

import Image from "next/image" // 导入 Image 组件
import { academicData } from "@/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  OverallScoreChart,
  OverallRankChart,
  SubjectScoreChart,
  SubjectClassRankChart,
  SubjectSchoolRankChart,
  ClassRankBarChart, // 导入新的班级排名柱状图组件
  SchoolRankBarChart, // 导入新的年级排名柱状图组件
} from "@/components/charts"
import { cn } from "@/lib/utils" // 导入cn函数

// 定义颜色常量
const COLOR_RISING = "#22C55E" // 绿色
const COLOR_FALLING = "#EF4444" // 红色
const COLOR_STABLE = "#3B82F6" // 蓝色

// Helper function to get trend string
type Trend = "rising" | "falling" | "stable" | "no_data" | "single_data"

const getTrend = (firstValue: number, lastValue: number): Trend => {
  if (lastValue > firstValue) return "rising"
  if (lastValue < firstValue) return "falling"
  return "stable"
}

// Helper function to get trend color based on trend string
const getTrendColor = (trend: Trend): string => {
  switch (trend) {
    case "rising":
      return COLOR_RISING
    case "falling":
      return COLOR_FALLING
    case "stable":
      return COLOR_STABLE
    default:
      return "#888888" // Default color for no data or single data
  }
}

// Helper function to generate ranking analysis text
const getRankingAnalysis = (data: typeof academicData, subject: string, rankType: "class" | "school") => {
  const ranks = data
    .map((item) => item.subjectRanks[subject]?.[rankType])
    .filter((rank) => rank !== null && rank !== undefined) as number[]

  if (ranks.length === 0) {
    return {
      __html: `暂无${subject}科目${rankType === "class" ? "班级" : "年级"}排名数据。`,
      trend: "no_data" as Trend,
    }
  }

  const firstRank = ranks[0]
  const lastRank = ranks[ranks.length - 1]
  const minRank = Math.min(...ranks)
  const maxRank = Math.max(...ranks)

  let analysis = `${subject}科目${rankType === "class" ? "班级" : "年级"}排名趋势：`
  let trend: Trend = "stable"

  if (ranks.length === 1) {
    analysis += `仅有一次考试数据，排名为 ${firstRank}。`
    trend = "single_data"
  } else {
    if (lastRank < firstRank) {
      analysis += `整体呈现<strong class="text-green-600">上升趋势</strong>，排名逐渐靠前。`
      trend = "rising"
    } else if (lastRank > firstRank) {
      analysis += `整体呈现<strong class="text-red-600">下降趋势</strong>，排名有所退步。`
      trend = "falling"
    } else {
      analysis += `排名<strong class="text-blue-600">保持稳定</strong>。`
      trend = "stable"
    }

    analysis += `从最初的 ${firstRank} 名到最近的 ${lastRank} 名。`
    if (minRank !== maxRank) {
      analysis += `最好排名为 ${minRank} 名，最差排名为 ${maxRank} 名。`
    }
  }

  return { __html: analysis, trend }
}

// Helper function to generate score analysis text
const getScoreAnalysis = (data: typeof academicData, subject: string) => {
  const scores = data
    .map((item) => item.subjects[subject])
    .filter((score) => score !== null && score !== undefined) as number[]

  if (scores.length === 0) {
    return { __html: `暂无${subject}科目分数数据。`, trend: "no_data" as Trend }
  }

  const firstScore = scores[0]
  const lastScore = scores[scores.length - 1]
  const maxScore = Math.max(...scores)
  const minScore = Math.min(...scores)

  let analysis = `${subject}科目分数趋势：`
  let trend: Trend = "stable"

  if (scores.length === 1) {
    analysis += `仅有一次考试数据，分数为 ${firstScore}。`
    trend = "single_data"
  } else {
    if (lastScore > firstScore) {
      analysis += `整体呈现<strong class="text-green-600">上升趋势</strong>，分数有所提高。`
      trend = "rising"
    } else if (lastScore < firstScore) {
      analysis += `整体呈现<strong class="text-red-600">下降趋势</strong>，分数有所退步。`
      trend = "falling"
    } else {
      analysis += `分数<strong class="text-blue-600">保持稳定</strong>。`
      trend = "stable"
    }

    analysis += `从最初的 ${firstScore} 分到最近的 ${lastScore} 分。`
    if (minScore !== maxScore) {
      analysis += `最高分数为 ${maxScore} 分，最低分数为 ${minScore} 分。`
    }
  }

  return { __html: analysis, trend }
}

// 新增：生成所选科目总分分析文本
const getOverallScoreAnalysis = (data: typeof academicData) => {
  const totalScores = data
    .map((item) => item.selectedSubjectsTotalScore)
    .filter((score) => score !== null && score !== undefined) as number[]

  let analysis = "所选科目总分趋势：<br/>"
  let trend: Trend = "stable"

  if (totalScores.length === 0) {
    analysis += "暂无所选科目总分数据。<br/>"
    return { __html: analysis, trend: "no_data" as Trend }
  }

  if (totalScores.length > 1) {
    const firstTotalScore = totalScores[0]
    const lastTotalScore = totalScores[totalScores.length - 1]
    trend = getTrend(firstTotalScore, lastTotalScore)
    const trendText =
      trend === "rising"
        ? `<strong class="text-green-600">上升趋势</strong>`
        : trend === "falling"
          ? `<strong class="text-red-600">下降趋势</strong>`
          : `<strong class="text-blue-600">保持稳定</strong>`
    analysis += `整体呈现${trendText}，从 ${firstTotalScore} 分${
      trend === "rising" ? "提高" : trend === "falling" ? "下降" : "维持"
    }到 ${lastTotalScore} 分。<br/>`
  } else if (totalScores.length === 1) {
    analysis += `仅有一次所选科目总分数据，为 ${totalScores[0]} 分。<br/>`
    trend = "single_data"
  }

  return { __html: analysis, trend }
}

// 新增：生成年级排名分析文本
const getOverallRankAnalysis = (data: typeof academicData) => {
  const schoolRanks = data
    .map((item) => item.selectedSubjectsSchoolRank)
    .filter((rank) => rank !== null && rank !== undefined) as number[]

  let analysis = "年级排名趋势：<br/>"
  let trend: Trend = "stable"

  if (schoolRanks.length === 0) {
    analysis += "暂无年级排名数据。<br/>"
    return { __html: analysis, trend: "no_data" as Trend }
  }

  if (schoolRanks.length > 1) {
    const firstSchoolRank = schoolRanks[0]
    const lastSchoolRank = schoolRanks[schoolRanks.length - 1]
    // 排名越小越好，所以排名下降是上升趋势
    trend = getTrend(lastSchoolRank, firstSchoolRank) // 注意这里是反向比较，因为排名越小越好
    const trendText =
      trend === "rising"
        ? `<strong class="text-green-600">上升趋势</strong>`
        : trend === "falling"
          ? `<strong class="text-red-600">下降趋势</strong>`
          : `<strong class="text-blue-600">保持稳定</strong>`
    analysis += `整体呈现${trendText}，从 ${firstSchoolRank} 名${
      trend === "rising" ? "提高" : trend === "falling" ? "下降" : "维持"
    }到 ${lastSchoolRank} 名。<br/>`
  } else if (schoolRanks.length === 1) {
    analysis += `仅有一次年级排名数据，为 ${schoolRanks[0]} 名。<br/>`
    trend = "single_data"
  }

  return { __html: analysis, trend }
}

export default function AcademicReport() {
  const selectedSubjects = ["语文", "数学", "英语", "物理", "化学", "生物"] as const

  // 获取整体总分趋势和颜色
  const overallScoreAnalysis = getOverallScoreAnalysis(academicData)
  const overallScoreLineColor = getTrendColor(overallScoreAnalysis.trend)

  // 获取整体排名趋势和颜色
  const overallRankAnalysis = getOverallRankAnalysis(academicData)
  const overallRankLineColor = getTrendColor(overallRankAnalysis.trend)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 固定顶部标题区域 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md py-3 px-4 sm:px-6 lg:px-8 shadow-sm">
        <h1 className="text-2xl font-bold text-center">冯羿霖高一成绩报告</h1> {/* 标题字体缩小 */}
      </header>
      {/* 主内容区域，增加顶部内边距以避免被固定标题遮挡 */}
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        {" "}
        {/* 调整pt和pb，px保持不变以适应手机 */}
        {/* 原始成绩图片 */}
        <Image
          src="/images/report-card-results.png"
          alt="学生查看成绩单，突出学术成果"
          width={800}
          height={200}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        {/* 表格 1: 原始成绩 */}
        <Card className="mb-6 shadow-hazy-card">
          {" "}
          {/* 减少mb，添加自定义阴影 */}
          <CardHeader>
            <CardTitle className="text-xl">原始成绩</CardTitle> {/* 子标题字体缩小 */}
          </CardHeader>
          <CardContent>
            <div>
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px] px-2 py-2">科目</TableHead>
                    {academicData.map((data, index) => (
                      <TableHead key={`exam-score-head-${index}`} className="text-right px-2 py-2">
                        {data.examName}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSubjects.map((subject, subIndex) => (
                    <TableRow key={`subject-score-row-${subIndex}`}>
                      <TableCell className="font-medium w-[60px] px-2 py-1">{subject}</TableCell>
                      {academicData.map((data, index) => (
                        <TableCell key={`score-cell-${subIndex}-${index}`} className="text-right px-2 py-1">
                          {data.subjects[subject] ?? "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-medium w-[60px] px-2 py-1">总分</TableCell>
                    {academicData.map((data, index) => (
                      <TableCell key={`total-score-cell-${index}`} className="text-right px-2 py-1">
                        {data.selectedSubjectsTotalScore ?? "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* 表格 2: 班级排名 */}
        <Card className="mb-6 shadow-hazy-card">
          {" "}
          {/* 减少mb，添加自定义阴影 */}
          <CardHeader>
            <CardTitle className="text-xl">班级排名</CardTitle> {/* 子标题字体缩小 */}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px] px-2 py-2">科目</TableHead>
                      {academicData.map((data, index) => (
                        <TableHead key={`exam-class-rank-head-${index}`} className="text-right px-2 py-2">
                          {data.examName}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSubjects.map((subject, subIndex) => (
                      <TableRow key={`subject-class-rank-row-${subIndex}`}>
                        <TableCell className="font-medium w-[60px] px-2 py-1">{subject}</TableCell>
                        {academicData.map((data, index) => {
                          const rank = data.subjectRanks[subject]?.class
                          const isTop10 = typeof rank === "number" && rank <= 10
                          return (
                            <TableCell
                              key={`class-rank-cell-${subIndex}-${index}`}
                              className={cn("text-right px-2 py-1", {
                                "font-bold text-green-700 bg-green-100/80": isTop10, // 突出显示前10名，增加背景色
                              })}
                            >
                              {rank ?? "-"}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-medium w-[60px] px-2 py-1">班排</TableCell>
                      {academicData.map((data, index) => (
                        <TableCell key={`total-class-rank-cell-${index}`} className="text-right px-2 py-1">
                          {data.selectedSubjectsClassRank ?? "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              {/* 新增：班级排名柱状图 */}
              <div className="mt-0">
                {" "}
                {/* 移除mt-6，因为现在是并排显示 */}
                <ClassRankBarChart data={academicData} subjects={selectedSubjects} />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 表格 3: 年级排名 */}
        <Card className="mb-6 shadow-hazy-card">
          {" "}
          {/* 减少mb，添加自定阴影 */}
          <CardHeader>
            <CardTitle className="text-xl">年级排名</CardTitle> {/* 子标题字体缩小 */}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px] px-2 py-2">科目</TableHead>
                      {academicData.map((data, index) => (
                        <TableHead key={`exam-school-rank-head-${index}`} className="text-right px-2 py-2">
                          {data.examName}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSubjects.map((subject, subIndex) => (
                      <TableRow key={`subject-school-rank-row-${subIndex}`}>
                        <TableCell className="font-medium w-[60px] px-2 py-1">{subject}</TableCell>
                        {academicData.map((data, index) => {
                          const rank = data.subjectRanks[subject]?.school
                          const isTop300 = typeof rank === "number" && rank <= 300
                          return (
                            <TableCell
                              key={`school-rank-cell-${subIndex}-${index}`}
                              className={cn("text-right px-2 py-1", {
                                "font-bold text-green-700 bg-green-100/80": isTop300, // 突出显示前300名，增加背景色
                              })}
                            >
                              {rank ?? "-"}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-medium w-[60px] px-2 py-1">年排</TableCell>
                      {academicData.map((data, index) => (
                        <TableCell key={`total-school-rank-cell-${index}`} className="text-right px-2 py-1">
                          {data.selectedSubjectsSchoolRank ?? "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              {/* 新增：年级排名柱状图 */}
              <div className="mt-0">
                {" "}
                {/* 移除mt-6，因为现在是并排显示 */}
                <SchoolRankBarChart data={academicData} subjects={selectedSubjects} />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 可视化分析部分 - 整体表现趋势 (拆分) */}
        <Image
          src="/images/overall-trend.png"
          alt="表现出上升趋势的图表，学生达成目标，学术进步"
          width={800}
          height={200}
          className="w-full h-48 object-cover rounded-lg mt-6 mb-4"
        />
        <h2 className="text-xl font-semibold mt-6 mb-3">1. 整体表现趋势</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 所选科目总分趋势 */}
          <Card className="mb-0 shadow-hazy-card">
            <CardHeader>
              <CardTitle className="text-lg font-medium">所选科目总分趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={overallScoreAnalysis}></p>
              <OverallScoreChart data={academicData} lineColor={overallScoreLineColor} />
            </CardContent>
          </Card>

          {/* 年级排名趋势 */}
          <Card className="mb-0 shadow-hazy-card">
            <CardHeader>
              <CardTitle className="text-lg font-medium">年级排名趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={overallRankAnalysis}></p>
              <OverallRankChart data={academicData} lineColor={overallRankLineColor} />
            </CardContent>
          </Card>
        </div>
        {/* 各科目分数趋势 - 拆分成独立卡片 */}
        <Image
          src="/images/subject-scores.png"
          alt="打开的教科书，带有各种科目符号，学习资料，学术研究"
          width={800}
          height={200}
          className="w-full h-48 object-cover rounded-lg mt-6 mb-4"
        />
        <h2 className="text-xl font-semibold mt-6 mb-3">2. 各科目分数趋势</h2> {/* h2字体缩小，减少mt和mb */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {" "}
          {/* 减少gap */}
          {selectedSubjects.map((subject) => {
            const scoreAnalysis = getScoreAnalysis(academicData, subject)
            const scoreLineColor = getTrendColor(scoreAnalysis.trend)
            return (
              <Card key={`score-chart-card-${subject}`} className="mb-0 shadow-hazy-card">
                {" "}
                {/* 添加自定义阴影 */}
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{subject}分数趋势</CardTitle> {/* 科目标题字体缩小 */}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={scoreAnalysis}></p>
                  <SubjectScoreChart data={academicData} subject={subject} lineColor={scoreLineColor} />
                </CardContent>
              </Card>
            )
          })}
        </div>
        {/* 各科目班级排名趋势 - 拆分成独立卡片 */}
        <Image
          src="/images/class-rank.png"
          alt="一群高中生一起学习，协作学习，课堂环境"
          width={800}
          height={200}
          className="w-full h-48 object-cover rounded-lg mt-6 mb-4"
        />
        <h2 className="text-xl font-semibold mt-6 mb-3">3.1 各科目班级排名趋势</h2> {/* 新增标题 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedSubjects.map((subject) => {
            const analysisHtml = getRankingAnalysis(academicData, subject, "class")
            const rankLineColor = getTrendColor(analysisHtml.trend)
            return (
              <Card key={`class-rank-chart-card-${subject}`} className="mb-0 shadow-hazy-card">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{subject}班级排名趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-sm text-gray-600 mb-4" // 移除动态颜色类，恢复默认文本颜色
                    dangerouslySetInnerHTML={analysisHtml}
                  ></p>
                  <SubjectClassRankChart data={academicData} subject={subject} lineColor={rankLineColor} />
                </CardContent>
              </Card>
            )
          })}
        </div>
        {/* 各科目年级排名趋势 - 拆分成独立卡片 */}
        <Image
          src="/images/school-rank.png"
          alt="毕业帽放在一叠书上，背景是学校建筑，象征学术成就和成功"
          width={800}
          height={200}
          className="w-full h-48 object-cover rounded-lg mt-6 mb-4"
        />
        <h2 className="text-xl font-semibold mt-6 mb-3">3.2 各科目年级排名趋势</h2> {/* 新增标题 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedSubjects.map((subject) => {
            const analysisHtml = getRankingAnalysis(academicData, subject, "school")
            const rankLineColor = getTrendColor(analysisHtml.trend)
            return (
              <Card key={`school-rank-chart-card-${subject}`} className="mb-0 shadow-hazy-card">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{subject}年级排名趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-sm text-gray-600 mb-4" // 移除动态颜色类，恢复默认文本颜色
                    dangerouslySetInnerHTML={analysisHtml}
                  ></p>
                  <SubjectSchoolRankChart data={academicData} subject={subject} lineColor={rankLineColor} />
                </CardContent>
              </Card>
            )
          })}
        </div>
        {/* 总结 */}
        <Image
          src="/images/summary.png"
          alt="学生在笔记本上书写，深思熟虑，规划未来的学术成功"
          width={800}
          height={200}
          className="w-full h-48 object-cover rounded-lg mt-6 mb-4"
        />
        <Card className="mb-6 mt-6 shadow-hazy-card">
          {" "}
          {/* 减少mb和mt，添加自定义阴影 */}
          <CardHeader>
            <CardTitle className="text-xl">4. 总结</CardTitle> {/* 子标题字体缩小 */}
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-base text-gray-700 space-y-2">
              <li>
                根据冯羿霖同学高一升高二选择的语文、数学、英语、物理、化学、生物这六门科目来看，其学习表现呈现出积极的进步趋势。
              </li>
              <li>数学和生物是其核心优势科目，表现稳定且排名极高，尤其在年级排名中表现突出。</li>
              <li>英语在高一下学期取得了显著突破，物理和化学表现稳定，语文则需要保持稳定并争取更高排名。</li>
              <li>整体而言，学生具备较强的学习潜力以及调整能力，尤其是在高一下期末考试中展现出的进步令人鼓舞。</li>
              <li>
                未来应继续巩固数学和生物的优势，并针对性地提升语文、英语、物理和化学的稳定性及排名，以期在高中阶段取得更优异的成绩。
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
