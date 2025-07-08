"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  BarChart,
  Bar,
} from "recharts"

// Custom Tooltip for better readability
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 text-sm shadow-md">
        <p className="font-bold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value ?? "-"}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface ChartData {
  semester: string
  examName: string
  [key: string]: any // For dynamic subject keys
}

interface OverallScoreChartProps {
  data: ChartData[]
  lineColor: string // 新增 prop
}

// 所选科目总分趋势图
export function OverallScoreChart({ data, lineColor }: OverallScoreChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.examName,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis orientation="left" width={40} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="selectedSubjectsTotalScore"
          stroke={lineColor} // 使用动态颜色
          name="所选科目总分"
          activeDot={{ r: 8 }}
          connectNulls={true} // 确保连接空值
        >
          <LabelList dataKey="selectedSubjectsTotalScore" position="top" />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  )
}

interface OverallRankChartProps {
  data: ChartData[]
  lineColor: string // 新增 prop
}

// 年级排名趋势图
export function OverallRankChart({ data, lineColor }: OverallRankChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.examName,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 5,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" orientation="top" />
        <YAxis
          orientation="left"
          reversed={true} // 排名越小（越好）在Y轴上方
          domain={[1, 900]} // 设置最大值为900
          ticks={[1, 250, 500, 750, 900]} // 确保显示1
          interval={0} // 强制显示所有刻度
          allowDataOverflow={true} // 允许数据溢出，确保刻度显示
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="selectedSubjectsSchoolRank"
          stroke={lineColor} // 使用动态颜色
          name="所选科目年级排名"
          activeDot={{ r: 8 }}
          connectNulls={true}
        >
          <LabelList dataKey="selectedSubjectsSchoolRank" position="bottom" />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  )
}

interface SubjectScoreChartProps {
  data: ChartData[]
  subject: string
  lineColor: string // 新增 prop
}

export function SubjectScoreChart({ data, subject, lineColor }: SubjectScoreChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.examName,
    score: item.subjects[subject],
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis width={40} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="score"
          stroke={lineColor}
          name={`${subject}分数`}
          activeDot={{ r: 8 }}
          connectNulls={true} // 添加此行以连接空值
        >
          <LabelList dataKey="score" position="top" />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  )
}

interface SubjectClassRankChartProps {
  data: ChartData[]
  subject: string
  lineColor: string // 新增 prop
}

export function SubjectClassRankChart({ data, subject, lineColor }: SubjectClassRankChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.examName,
    classRank: item.subjectRanks[subject]?.class,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 5,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" orientation="top" />
        <YAxis
          reversed={true}
          domain={[1, 50]}
          ticks={[1, 10, 20, 30, 40, 50]} // 确保显示1
          interval={0} // 强制显示所有刻度
          allowDataOverflow={true} // 允许数据溢出，确保刻度显示
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="classRank"
          stroke={lineColor} // 使用动态颜色
          name={`${subject}班级排名`}
          activeDot={{ r: 8 }}
          connectNulls={true}
        >
          <LabelList dataKey="classRank" position="bottom" />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  )
}

interface SubjectSchoolRankChartProps {
  data: ChartData[]
  subject: string
  lineColor: string // 新增 prop
}

export function SubjectSchoolRankChart({ data, subject, lineColor }: SubjectSchoolRankChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.examName,
    schoolRank: item.subjectRanks[subject]?.school,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 5,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" orientation="top" />
        <YAxis
          reversed={true}
          domain={[1, 900]}
          ticks={[1, 250, 500, 750, 900]} // 确保显示1
          interval={0} // 强制显示所有刻度
          allowDataOverflow={true} // 允许数据溢出，确保刻度显示
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="schoolRank"
          stroke={lineColor} // 使用动态颜色
          name={`${subject}年级排名`}
          activeDot={{ r: 8 }}
          connectNulls={true}
        >
          <LabelList dataKey="schoolRank" position="bottom" />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  )
}

interface BarChartProps {
  data: ChartData[]
  subjects: readonly string[]
}

// 为每个科目定义颜色
const subjectColors: { [key: string]: string } = {
  语文: "#8884d8", // 紫色
  数学: "#82ca9d", // 绿色
  英语: "#ffc658", // 黄色
  物理: "#a4de6c", // 浅绿色
  化学: "#d0ed57", // 柠檬绿
  生物: "#8dd1e1", // 蓝色
}

// 各科目班级排名柱状图
export function ClassRankBarChart({ data, subjects }: BarChartProps) {
  // 转换数据以适应多系列柱状图
  const chartData = data.map((item) => {
    const entry: { [key: string]: any } = { examName: item.examName }
    subjects.forEach((subject) => {
      entry[subject] = item.subjectRanks[subject]?.class ?? null
    })
    return entry
  })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 5,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="examName" orientation="top" />
        <YAxis
          reversed={true}
          domain={[1, 50]}
          ticks={[1, 10, 20, 30, 40, 50]} // 排名越小越好，Y轴反转
          interval={0} // 强制显示所有刻度
          allowDataOverflow={true} // 允许数据溢出，确保刻度显示
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        {subjects.map((subject) => (
          <Bar key={subject} dataKey={subject} fill={subjectColors[subject]} name={`${subject}班级排名`}>
            <LabelList dataKey={subject} position="top" />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

// 各科目年级排名柱状图
export function SchoolRankBarChart({ data, subjects }: BarChartProps) {
  // 转换数据以适应多系列柱状图
  const chartData = data.map((item) => {
    const entry: { [key: string]: any } = { examName: item.examName }
    subjects.forEach((subject) => {
      entry[subject] = item.subjectRanks[subject]?.school ?? null
    })
    return entry
  })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 5,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="examName" orientation="top" />
        <YAxis
          reversed={true}
          domain={[1, 900]}
          ticks={[1, 250, 500, 750, 900]} // 排名越小越好，Y轴反转，最大值900
          interval={0} // 强制显示所有刻度
          allowDataOverflow={true} // 允许数据溢出，确保刻度显示
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        {subjects.map((subject) => (
          <Bar key={subject} dataKey={subject} fill={subjectColors[subject]} name={`${subject}年级排名`}>
            <LabelList dataKey={subject} position="top" />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
